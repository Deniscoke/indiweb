// @vitest-environment jsdom
import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { RotatingWord } from '@/components/home/rotating-word'

const WORDS = ['prodávají', 'zaujmou', 'pracují za vás']

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function currentWord(container: HTMLElement) {
  return container.querySelector('[data-rotating-word]')?.textContent
}

it('cycles through the words and wraps around', () => {
  const { container } = render(<RotatingWord words={WORDS} interval={2200} />)
  expect(currentWord(container)).toBe('prodávají')
  act(() => vi.advanceTimersByTime(2200))
  expect(currentWord(container)).toBe('zaujmou')
  act(() => vi.advanceTimersByTime(2200))
  expect(currentWord(container)).toBe('pracují za vás')
  act(() => vi.advanceTimersByTime(2200))
  expect(currentWord(container)).toBe('prodávají')
})

it('keeps the first word for screen readers', () => {
  const { container } = render(<RotatingWord words={WORDS} />)
  expect(container.querySelector('.sr-only')?.textContent).toBe('prodávají')
})

it('stays on the first word when the visitor prefers reduced motion', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  const { container } = render(<RotatingWord words={WORDS} interval={2200} />)
  act(() => vi.advanceTimersByTime(6600))
  expect(currentWord(container)).toBe('prodávají')
})
