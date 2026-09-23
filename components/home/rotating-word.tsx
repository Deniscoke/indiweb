'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type RotatingWordProps = { words: readonly string[]; interval?: number }

export function RotatingWord({ words, interval = 2200 }: RotatingWordProps) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion || words.length < 2) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => window.clearInterval(id)
  }, [reducedMotion, words.length, interval])

  const word = words[reducedMotion ? 0 : index]

  return (
    <span className="relative inline-block text-accent">
      <span className="sr-only">{words[0]}</span>
      <span key={word} aria-hidden="true" data-rotating-word className="inline-block motion-safe:animate-word-in">
        {word}
      </span>
    </span>
  )
}
