// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { voiceLevel, VoiceDots } from '@/components/aria/voice-dots'

it('keeps the voice level between silence and full', () => {
  for (let t = 0; t < 20; t += 0.37) {
    for (let x = 0; x <= 1; x += 0.1) {
      const level = voiceLevel(x, t)
      expect(level).toBeGreaterThanOrEqual(0)
      expect(level).toBeLessThanOrEqual(1)
    }
  }
})

it('fades the voice out towards both edges', () => {
  expect(voiceLevel(0, 3)).toBeLessThan(voiceLevel(0.5, 3) + 0.001)
  expect(voiceLevel(0, 3)).toBeCloseTo(0)
})

it('is a decorative canvas that survives a missing 2D context', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  const { container } = render(<VoiceDots />)
  expect(container.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true')
})

it('follows a real voice when given its loudness: silent is small, loud is big', () => {
  const quiet = voiceLevel(0.5, 3, 0)
  const loud = voiceLevel(0.5, 3, 1)
  expect(loud).toBeGreaterThan(quiet * 3)
  expect(voiceLevel(0.5, 3, 5)).toBeLessThanOrEqual(1)
})
