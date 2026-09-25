// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

const { LenisMock } = vi.hoisted(() => ({
  LenisMock: vi.fn(
    class {
      on = vi.fn()
      raf = vi.fn()
      destroy = vi.fn()
    },
  ),
}))
vi.mock('lenis', () => ({ default: LenisMock }))

import { SMOOTH_SCROLL_QUERY, SmoothScroll } from '@/components/story/smooth-scroll'

function stubMedia(matching: string[]) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: matching.includes(query),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

it('smooths wheel scrolling on a desktop with a mouse', () => {
  stubMedia([SMOOTH_SCROLL_QUERY])
  render(<SmoothScroll />)
  expect(LenisMock).toHaveBeenCalledTimes(1)
})

it('keeps native scrolling on touch screens and with reduced motion', () => {
  stubMedia([])
  render(<SmoothScroll />)
  expect(LenisMock).not.toHaveBeenCalled()
})

it('stops smoothing when unmounted', () => {
  stubMedia([SMOOTH_SCROLL_QUERY])
  const { unmount } = render(<SmoothScroll />)
  const instance = LenisMock.mock.results[0].value
  unmount()
  expect(instance.destroy).toHaveBeenCalled()
})
