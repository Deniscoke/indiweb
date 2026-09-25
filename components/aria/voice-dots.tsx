'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const COLUMNS = 36
const ROWS = 11

/**
 * Loudness (0–1) of the voice at horizontal position x (0–1) and time t: a few
 * drifting waves, like syllables, fading out at both edges. Without `loudness`
 * the phrasing is simulated; with it (0–1) the dots follow a real voice.
 */
export function voiceLevel(x: number, t: number, loudness?: number): number {
  const envelope = Math.sin(Math.PI * x) ** 1.5
  const speech =
    0.5 +
    0.28 * Math.sin(x * 9 + t * 2.1) +
    0.14 * Math.sin(x * 23 - t * 3.7) +
    0.08 * Math.sin(t * 5.3 + x * 3)
  const phrase =
    loudness === undefined ? 0.55 + 0.45 * Math.sin(t * 0.9) ** 2 : 0.08 + 0.92 * Math.min(1, Math.max(0, loudness))
  return Math.min(1, Math.max(0, envelope * speech * phrase))
}

/**
 * A grid of dots that swells like a voice speaking — Aria's visual signature.
 * The dots take the canvas's CSS colour, so a section can recolour them, and
 * follow `loudness` (0–1, read every frame) while a real voice is speaking.
 */
export function VoiceDots({ loudness }: { loudness?: () => number | undefined }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loudnessRef = useRef(loudness)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    loudnessRef.current = loudness
  }, [loudness])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let frame = 0
    let visible = false

    const draw = (time: number) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      if (canvas.width !== Math.round(width * ratio)) {
        canvas.width = Math.round(width * ratio)
        canvas.height = Math.round(height * ratio)
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      const gapX = width / COLUMNS
      const gapY = height / ROWS
      const t = time / 1000
      const live = loudnessRef.current?.()
      // The dots take the canvas's CSS colour, so a section can recolour them.
      context.fillStyle = getComputedStyle(canvas).color
      for (let col = 0; col < COLUMNS; col++) {
        const level = voiceLevel((col + 0.5) / COLUMNS, t, live)
        for (let row = 0; row < ROWS; row++) {
          // Distance from the centre line, 0 (centre) to 1 (edge).
          const distance = Math.abs(row - (ROWS - 1) / 2) / ((ROWS - 1) / 2)
          const lit = Math.max(0, Math.min(1, (level * 1.6 - distance * 0.85) * 2.6))
          const radius = 1.2 + lit * Math.min(gapX, gapY) * 0.26
          context.globalAlpha = 0.12 + lit * 0.88
          context.beginPath()
          context.arc((col + 0.5) * gapX, (row + 0.5) * gapY, radius, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const loop = (time: number) => {
      draw(time)
      if (visible) frame = requestAnimationFrame(loop)
    }

    if (reducedMotion || !('IntersectionObserver' in window)) {
      draw(2400)
      return
    }

    // Animate only while on screen.
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(loop)
    })
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className="block aspect-[36/11] w-full text-accent" />
}
