'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'

/** Smooth, inertial wheel scrolling — only with a mouse and when motion is welcome. */
export const SMOOTH_SCROLL_QUERY = '(pointer: fine) and (prefers-reduced-motion: no-preference)'

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function' || !window.matchMedia(SMOOTH_SCROLL_QUERY).matches) return

    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    // Lenis runs on GSAP's clock so scroll and scroll-driven animations move in the same frame.
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return null
}
