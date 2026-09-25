'use client'

import { useEffect, useRef, useState } from 'react'
import {
  INTRO_DURATION,
  INTRO_FONT_SCALE,
  INTRO_TEXT_Y,
  fitShaderFrame,
  introFrameHeight,
  introOverlay,
  introPixelRatio,
  introSceneTime,
  markIntroSeen,
} from '@/lib/intro'
import { createIntroSound, type IntroSound } from './intro-sound'

const SKIP_FADE_MS = 400

export function IntroCinematic() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const enterButtonRef = useRef<HTMLButtonElement>(null)
  const enterRef = useRef<() => void>(() => {})
  const skipRef = useRef<() => void>(() => {})
  const soundRef = useRef<IntroSound | null>(null)
  const [entered, setEntered] = useState(false)

  const releaseSound = (seconds?: number) => {
    soundRef.current?.release(seconds)
    soundRef.current = null
  }

  useEffect(() => {
    const html = document.documentElement
    const root = rootRef.current
    const host = hostRef.current
    const wordmark = wordmarkRef.current
    if (html.dataset.intro !== 'play' || !root || !host || !wordmark) return

    let frameId = 0
    let fadeTimer = 0
    let entering = false
    let finished = false
    let skipping = false
    let unmounted = false
    let dispose = () => {}
    let resize = () => {}

    // Loaded only when the intro is due (other visits never pay for it), and
    // already while the visitor looks at the entrance, so the scene starts at once.
    const loading = Promise.all([import('three'), import('./aperture/engine')])
    loading.catch(() => {})
    enterButtonRef.current?.focus({ preventScroll: true })

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(frameId)
      // The chord rings out into the site instead of stopping dead.
      releaseSound()
      markIntroSeen()
      delete html.dataset.intro
      dispose()
    }

    skipRef.current = () => {
      if (finished || skipping) return
      skipping = true
      cancelAnimationFrame(frameId)
      releaseSound(1.2)
      root.style.transition = `opacity ${SKIP_FADE_MS}ms ease`
      root.style.opacity = '0'
      fadeTimer = window.setTimeout(finish, SKIP_FADE_MS)
    }

    const play = async () => {
      const [THREE, scene] = await loading
      if (unmounted || finished || skipping) return

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      })
      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uFrameHeight: { value: 0 },
        ...scene.createOpticalState(),
      }
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: scene.vertexShader,
        fragmentShader: fitShaderFrame(scene.fragmentShader),
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      })
      const geometry = new THREE.PlaneGeometry(2, 2)
      const plane = new THREE.Mesh(geometry, material)
      plane.frustumCulled = false
      const stage = new THREE.Scene()
      stage.add(plane)
      const camera = new THREE.Camera()
      host.append(renderer.domElement)
      dispose = () => {
        material.dispose()
        geometry.dispose()
        renderer.dispose()
      }

      resize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
        const ratio = introPixelRatio(width, height, window.devicePixelRatio, coarse)
        const frameHeight = introFrameHeight(width, height)
        renderer.setPixelRatio(ratio)
        renderer.setSize(width, height)
        uniforms.uFrameHeight.value = frameHeight * ratio
        root.style.setProperty('--intro-text-y', `${height / 2 + (INTRO_TEXT_Y - 0.5) * frameHeight}px`)
        root.style.setProperty('--intro-font-size', `${frameHeight * INTRO_FONT_SCALE}px`)
      }
      resize()
      window.addEventListener('resize', resize)

      const startedAt = performance.now()
      const render = (now: number) => {
        const elapsed = (now - startedAt) / 1000
        const time = introSceneTime(elapsed)
        uniforms.uTime.value = time
        soundRef.current?.update(elapsed)
        renderer.getDrawingBufferSize(uniforms.uResolution.value)
        scene.sampleTimeline(time, uniforms)
        renderer.render(stage, camera)
        const overlay = introOverlay(time)
        wordmark.style.setProperty('--lit', String(overlay.text))
        root.style.opacity = String(overlay.opacity)
        if (elapsed >= INTRO_DURATION) finish()
        else frameId = requestAnimationFrame(render)
      }
      frameId = requestAnimationFrame(render)
    }

    enterRef.current = () => {
      if (entering || finished || skipping) return
      entering = true
      // The entrance click is the gesture browsers require before a page may
      // play sound, so the soundtrack starts together with the picture.
      soundRef.current = createIntroSound()
      // Without WebGL 2 (or if loading fails) the visitor simply lands on the site.
      play().catch(finish)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skipRef.current()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      unmounted = true
      cancelAnimationFrame(frameId)
      window.clearTimeout(fadeTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      releaseSound(0.2)
      dispose()
    }
  }, [])

  const enter = () => {
    enterRef.current()
    setEntered(true)
  }

  return (
    // Before the intro starts a click anywhere enters it; once it plays, a click skips it.
    <div ref={rootRef} className="intro" onClick={() => (entered ? skipRef.current() : enter())}>
      <div ref={hostRef} aria-hidden="true" className="intro-scene" />
      <p ref={wordmarkRef} aria-hidden="true" className="intro-wordmark font-display">
        <span className="intro-wordmark__text">IndiWeb</span>
      </p>
      <div className="intro-gate" data-entered={entered || undefined} inert={entered}>
        <span aria-hidden="true" className="intro-gate__spark" />
        <button
          ref={enterButtonRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            enter()
          }}
          className="intro-gate__enter"
        >
          Vstoupit
        </button>
        <p className="font-mono text-xs text-fg-faint">se zvukem</p>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          skipRef.current()
        }}
        className="absolute right-6 bottom-6 z-10 rounded-full border border-line-strong px-5 py-2.5 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        Přeskočit intro
      </button>
    </div>
  )
}
