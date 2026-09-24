// @vitest-environment jsdom
import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { PointerLight } from '@/components/light/pointer-light'

const style = document.documentElement.style

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
})

afterEach(() => {
  style.removeProperty('--mx')
  style.removeProperty('--my')
  style.removeProperty('--py')
})

it('moves the light to the pointer position', () => {
  render(<PointerLight />)
  act(() => {
    fireEvent.pointerMove(window, { clientX: 120, clientY: 80, pointerType: 'mouse' })
  })
  expect(style.getPropertyValue('--mx')).toBe('120px')
  expect(style.getPropertyValue('--my')).toBe('80px')
})

it('also exposes the page position for elements that scroll with the page', () => {
  Object.defineProperty(window, 'scrollY', { value: 300, configurable: true })
  render(<PointerLight />)
  act(() => {
    fireEvent.pointerMove(window, { clientX: 10, clientY: 50, pointerType: 'mouse' })
  })
  expect(style.getPropertyValue('--py')).toBe('350px')
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
})

it('ignores touch input, which has no hovering light', () => {
  render(<PointerLight />)
  act(() => {
    fireEvent.pointerMove(window, { clientX: 5, clientY: 5, pointerType: 'touch' })
  })
  expect(style.getPropertyValue('--mx')).toBe('')
})

it('renders a decorative light layer', () => {
  const { container } = render(<PointerLight />)
  expect(container.querySelector('.pointer-light')?.getAttribute('aria-hidden')).toBe('true')
})
