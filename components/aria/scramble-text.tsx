'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const GLYPHS = '░▒▓/\|:·+×01'
const DURATION_MS = 1400

/**
 * The text at a given progress (0–1): characters left of the progress point are
 * final, the rest are random glyphs. Spaces stay spaces so the words keep their shape.
 */
export function scrambleFrame(text: string, progress: number, random: () => number = Math.random): string {
  const resolved = Math.floor(text.length * Math.min(1, Math.max(0, progress)))
  return [...text]
    .map((char, index) => {
      if (index < resolved || char === ' ') return char
      return GLYPHS[Math.floor(random() * GLYPHS.length)]
    })
    .join('')
}

/** Text that assembles itself out of scattered glyphs when it scrolls into view. */
export function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion || !('IntersectionObserver' in window)) return
    let frame = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = (now - start) / DURATION_MS
        setDisplay(scrambleFrame(text, progress))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        run()
      },
      { threshold: 0.6 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [text, reducedMotion])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {display}
      </span>
    </>
  )
}
