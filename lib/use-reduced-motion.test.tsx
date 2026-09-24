// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useReducedMotion } from '@/lib/use-reduced-motion'

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}

it('is false when the browser has no matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
})

it('follows the prefers-reduced-motion media query', () => {
  stubMatchMedia(true)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
  stubMatchMedia(false)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
})
