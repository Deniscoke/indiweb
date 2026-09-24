// @vitest-environment jsdom
import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { PointerLight } from '@/components/light/pointer-light'

const style = document.documentElement.style

beforeEach(() => {
  // jsdom has no WebGL: the light runs in its CSS fallback mode.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

afterEach(() => {
  vi.restoreAllMocks()
  style.removeProperty('--mx')
  style.removeProperty('--my')
})

it('is a decorative canvas', () => {
  const { container } = render(<PointerLight />)
  expect(container.querySelector('canvas.page-light')?.getAttribute('aria-hidden')).toBe('true')
})

it('falls back to a CSS glow without WebGL and still places the light', () => {
  const { container } = render(<PointerLight />)
  expect((container.querySelector('canvas') as HTMLCanvasElement).dataset.fallback).toBe('true')
  expect(style.getPropertyValue('--mx')).toMatch(/px$/)
})

it('moves the light to the pointer so lit text follows it', () => {
  render(<PointerLight />)
  act(() => {
    fireEvent.pointerMove(window, { clientX: 120, clientY: 80, pointerType: 'mouse' })
  })
  expect(style.getPropertyValue('--mx')).toBe('120px')
  expect(style.getPropertyValue('--my')).toBe('80px')
})

it('ignores touch input, which has no hovering light', () => {
  render(<PointerLight />)
  const before = style.getPropertyValue('--mx')
  act(() => {
    fireEvent.pointerMove(window, { clientX: 5, clientY: 5, pointerType: 'touch' })
  })
  expect(style.getPropertyValue('--mx')).toBe(before)
})
