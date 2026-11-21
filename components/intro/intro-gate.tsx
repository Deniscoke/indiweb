'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import type { Locale } from '@/lib/i18n'

/** One way in: a language, and the gate's few words in that language. */
export type GateLanguage = { locale: Locale; name: string; choose: string; enter: string; withSound: string }

type IntroGateProps = {
  languages: GateLanguage[]
  /** The language of the page behind the gate: its lens is the suggested way in. */
  current: Locale
  chosen: Locale | null
  entered: boolean
  onChoose: (locale: Locale) => void
}

/** The spark sits this far down the stage; the beams fan out from it. Matches --spark-y in globals.css. */
const SPARK_Y = 0.4
/** The prism's spread: the white spark split into rose, the site's lilac, and blue. */
const TINTS = ['255 196 236', '217 184 255', '184 200 255']
const GLYPHS = 'abcdefghijklmnopqrstuvwxyzáéíčšžüöä'
const SCRAMBLE_MS = 520
const CYCLE_MS = 2600

/**
 * The entrance: one spark of white light split three ways, as through a prism,
 * each beam ending in a lens that holds a language. Until a lens is held the
 * question is asked in every language in turn; choosing one flies through it.
 */
export function IntroGate({ languages, current, chosen, entered, onChoose }: IntroGateProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const settled = chosen !== null
  const first = languages.find((language) => language.locale === current) ?? languages[0]

  useEffect(() => {
    const stage = stageRef.current
    const heading = headingRef.current
    const hint = hintRef.current
    // The gate is in every page's markup but shown only while the intro waits.
    const waiting = () => document.documentElement.dataset.intro === 'play'
    if (!stage || !heading || !hint || settled || !waiting()) return

    const lenses = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-lens]'))
    const beams = Array.from(stage.querySelectorAll<SVGLineElement>('[data-beam]'))
    const lights = Array.from(stage.querySelectorAll<SVGLinearGradientElement>('[data-beam-light]'))
    const spark = stage.querySelector<HTMLElement>('[data-spark]')
    let frame = 0
    let held: number | null = null
    let asked = Math.max(0, languages.indexOf(first))
    let looks: [number, number][] = []

    // Rewrites the heading letter by letter, as if the light were resolving it.
    const scramble = (to: string) => {
      cancelAnimationFrame(frame)
      const length = Math.max(heading.textContent?.length ?? 0, to.length)
      const start = performance.now()
      const step = (now: number) => {
        const done = Math.min(1, (now - start) / SCRAMBLE_MS) * length
        let text = ''
        for (let i = 0; i < length; i++) {
          if (i < done || to[i] === ' ') text += to[i] ?? ''
          else text += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        heading.textContent = text
        if (done < length) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    // Beams run from the spark to each lens's rim. Measured from layout offsets,
    // which the lenses' drifting and blooming transforms do not disturb.
    const layout = () => {
      const row = lenses[0]?.offsetParent as HTMLElement | null
      if (!row) return
      const sx = stage.clientWidth / 2
      const sy = stage.clientHeight * SPARK_Y
      looks = lenses.map((lens, index) => {
        const radius = (lens.querySelector<HTMLElement>('[data-glass]')?.offsetWidth ?? 0) / 2
        const dx = row.offsetLeft + lens.offsetLeft + lens.offsetWidth / 2 - sx
        const dy = row.offsetTop + lens.offsetTop + radius - sy
        const distance = Math.hypot(dx, dy) || 1
        const reach = Math.max(0, (distance - radius - 4) / distance)
        for (const line of [beams[index], lights[index % lights.length]]) {
          line?.setAttribute('x1', String(sx))
          line?.setAttribute('y1', String(sy))
          line?.setAttribute('x2', String(sx + dx * reach))
          line?.setAttribute('y2', String(sy + dy * reach))
        }
        return [dx / distance, dy / distance]
      })
    }
    layout()
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(layout) : null
    observer?.observe(stage)

    const hold = (index: number | null) => {
      if (held === index) return
      held = index
      if (index === null) stage.removeAttribute('data-held')
      else stage.setAttribute('data-held', String(index))
      // The spark looks at the lens that is held.
      const [x, y] = index === null ? [0, 0] : (looks[index] ?? [0, 0])
      spark?.style.setProperty('--look-x', `${x * 9}px`)
      spark?.style.setProperty('--look-y', `${y * 9}px`)
      if (index === null) return
      scramble(languages[index].enter)
      hint.textContent = languages[index].withSound
    }

    // The first lens is focused for the keyboard as the gate opens; that alone
    // should not stop the question from going round.
    let keyboard = false
    const onKeyDown = () => (keyboard = true)
    stage.addEventListener('keydown', onKeyDown)
    const cleanups = lenses.map((lens, index) => {
      const enter = () => hold(index)
      const leave = () => hold(null)
      const focus = () => keyboard && hold(index)
      lens.addEventListener('pointerenter', enter)
      lens.addEventListener('pointerleave', leave)
      lens.addEventListener('focus', focus)
      lens.addEventListener('blur', leave)
      return () => {
        lens.removeEventListener('pointerenter', enter)
        lens.removeEventListener('pointerleave', leave)
        lens.removeEventListener('focus', focus)
        lens.removeEventListener('blur', leave)
      }
    })

    const cycle = window.setInterval(() => {
      if (!waiting()) return window.clearInterval(cycle)
      if (held !== null) return
      asked = (asked + 1) % languages.length
      scramble(languages[asked].choose)
      hint.textContent = languages[asked].withSound
    }, CYCLE_MS)

    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(cycle)
      observer?.disconnect()
      stage.removeEventListener('keydown', onKeyDown)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [languages, first, settled])

  return (
    <div className="intro-gate" data-chosen={settled || undefined} data-entered={entered || undefined} inert={settled}>
      <span aria-hidden="true" className="intro-gate__iris" />
      <span aria-hidden="true" className="intro-gate__iris intro-gate__iris--inner" />
      <div ref={stageRef} className="intro-gate__stage">
        {/* Decorative: it keeps changing. The group below carries the question for screen readers. */}
        <p ref={headingRef} aria-hidden="true" className="intro-gate__heading font-display">
          {first.choose}
        </p>
        <svg aria-hidden="true" className="intro-gate__beams">
          <defs>
            {TINTS.map((tint, index) => (
              // In user space: a bounding-box gradient vanishes on the perfectly vertical middle beam.
              <linearGradient key={tint} id={`intro-beam-${index}`} data-beam-light={index} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor={`rgb(${tint})`} />
              </linearGradient>
            ))}
          </defs>
          {languages.map((language, index) => (
            <line
              key={language.locale}
              data-beam={index}
              pathLength={1}
              stroke={`url(#intro-beam-${index % TINTS.length})`}
            />
          ))}
        </svg>
        <span data-spark aria-hidden="true" className="intro-gate__spark" />
        <div
          role="group"
          aria-label={languages.map((language) => language.choose).join(' · ')}
          className="intro-gate__lenses"
        >
          {languages.map((language, index) => (
            <button
              key={language.locale}
              type="button"
              lang={language.locale}
              data-lens={index}
              data-current={language.locale === current || undefined}
              data-chosen={language.locale === chosen || undefined}
              aria-label={`${language.enter} (${language.withSound})`}
              onClick={(event) => {
                event.stopPropagation()
                onChoose(language.locale)
              }}
              className="intro-lens"
              style={{ '--tint': TINTS[index % TINTS.length] } as CSSProperties}
            >
              <span className="intro-lens__float">
                <span data-glass className="intro-lens__glass">
                  <span className="intro-lens__code">{language.locale}</span>
                </span>
                <span className="intro-lens__name">{language.name}</span>
              </span>
            </button>
          ))}
        </div>
        <p ref={hintRef} aria-hidden="true" className="intro-gate__hint">
          {first.withSound}
        </p>
      </div>
    </div>
  )
}
