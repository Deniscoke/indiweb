'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

/**
 * Full scroll story: pinned scenes, fly-throughs, horizontal travel. Needs a
 * screen big enough for a pinned section to fit, so tablets and short laptop
 * windows get the simplified story instead of cropped scenes.
 */
export const DESKTOP_MOTION = '(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)'
/** Simplified story for phones and smaller screens: reveals without pinned scenes. */
export const MOBILE_MOTION =
  '(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 599px) and (prefers-reduced-motion: no-preference)'

export type SceneMode = { desktop: boolean; mobile: boolean }

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Builds a section's scroll animation for the current device. Nothing runs when
 * the visitor prefers reduced motion, so the static layout is always the baseline;
 * everything is reverted automatically on unmount or when the media query changes,
 * together with any cleanup the scene returns (e.g. for classes it toggled itself).
 */
export function useScene(scope: RefObject<HTMLElement | null>, build: (mode: SceneMode) => void | (() => void)): void {
  useGSAP(
    () => {
      if (typeof window.matchMedia !== 'function') return
      // Scoped, so the scene's selectors only match inside its own section.
      const media = gsap.matchMedia(scope.current ?? undefined)
      media.add({ desktop: DESKTOP_MOTION, mobile: MOBILE_MOTION }, (context) => {
        const { desktop, mobile } = context.conditions as SceneMode
        // A returned function runs when the scene is reverted.
        if (desktop || mobile) return build({ desktop, mobile })
      })
      return () => media.revert()
    },
    { scope },
  )
}

export { gsap, ScrollTrigger }

/** Whether the element, plus `margin` pixels, fits in the viewport: only then can it be pinned whole. */
export function fitsInView(element: Element | null | undefined, margin = 0): boolean {
  if (!element) return false
  return element.getBoundingClientRect().height + margin <= window.innerHeight
}
