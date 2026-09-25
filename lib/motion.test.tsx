// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { useRef } from 'react'
import { expect, it, vi } from 'vitest'
import { DESKTOP_MOTION, fitsInView, MOBILE_MOTION, stepAt, useScene, type SceneMode } from '@/lib/motion'

function stubMedia(matching: string[]) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: matching.includes(query),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  )
}

function Scene({ onBuild }: { onBuild: (mode: SceneMode) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useScene(ref, onBuild)
  return <div ref={ref} />
}

it('builds the full scene on a desktop that allows motion', () => {
  stubMedia([DESKTOP_MOTION])
  const build = vi.fn()
  render(<Scene onBuild={build} />)
  expect(build).toHaveBeenCalledWith(expect.objectContaining({ desktop: true, mobile: false }))
})

it('builds the simplified scene on a phone', () => {
  stubMedia([MOBILE_MOTION])
  const build = vi.fn()
  render(<Scene onBuild={build} />)
  expect(build).toHaveBeenCalledWith(expect.objectContaining({ desktop: false, mobile: true }))
})

it('leaves the page static when the visitor prefers reduced motion', () => {
  stubMedia([])
  const build = vi.fn()
  render(<Scene onBuild={build} />)
  expect(build).not.toHaveBeenCalled()
})

it('does nothing without matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined)
  const build = vi.fn()
  render(<Scene onBuild={build} />)
  expect(build).not.toHaveBeenCalled()
})

it('runs the cleanup a scene returns when it is torn down', () => {
  stubMedia([DESKTOP_MOTION])
  const cleanup = vi.fn()
  const { unmount } = render(<Scene onBuild={() => cleanup} />)
  expect(cleanup).not.toHaveBeenCalled()
  unmount()
  expect(cleanup).toHaveBeenCalledTimes(1)
})

it('tells whether an element fits on screen with room to spare', () => {
  const box = document.createElement('div')
  box.getBoundingClientRect = () => ({ height: 600 }) as DOMRect
  vi.stubGlobal('innerHeight', 800)
  expect(fitsInView(box)).toBe(true)
  expect(fitsInView(box, 150)).toBe(true)
  expect(fitsInView(box, 250)).toBe(false)
  expect(fitsInView(null)).toBe(false)
})

it('picks the step a scrubbed timeline is closest to', () => {
  expect(stepAt(0, 4)).toBe(0)
  expect(stepAt(0.49, 4)).toBe(0)
  expect(stepAt(0.51, 4)).toBe(1)
  expect(stepAt(2.7, 4)).toBe(3)
  expect(stepAt(9, 4)).toBe(3)
  expect(stepAt(-1, 4)).toBe(0)
})
