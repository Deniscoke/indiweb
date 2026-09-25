import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom has no matchMedia, but GSAP's ScrollTrigger needs it at load time.
// Default: no media query matches (like a browser with animations off);
// individual tests override it with vi.stubGlobal.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  cleanup()
})
