'use client'

import { useEffect } from 'react'

/**
 * Feeds the pointer position into CSS custom properties on <html>:
 * --mx/--my (viewport) drive the page-wide light and `.lit` text,
 * --py (page) lets absolutely positioned lights follow inside a section.
 */
export function PointerLight() {
  useEffect(() => {
    const style = document.documentElement.style
    let frame = 0
    let x = 0
    let y = 0

    const apply = () => {
      frame = 0
      style.setProperty('--mx', `${x}px`)
      style.setProperty('--my', `${y}px`)
      style.setProperty('--py', `${y + window.scrollY}px`)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      x = event.clientX
      y = event.clientY
      if (!frame) frame = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div aria-hidden="true" className="pointer-light" />
}
