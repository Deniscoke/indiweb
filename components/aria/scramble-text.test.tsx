// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { scrambleFrame, ScrambleText } from '@/components/aria/scramble-text'

it('gives screen readers the real text only', () => {
  const { container } = render(<ScrambleText text="Aria mluví" />)
  expect(screen.getByText('Aria mluví', { selector: '.sr-only' })).toBeTruthy()
  expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
})

it('shows the final text when it cannot animate', () => {
  const { container } = render(<ScrambleText text="Aria mluví" />)
  expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('Aria mluví')
})

it('resolves characters from left to right and keeps spaces', () => {
  const start = scrambleFrame('Aria mluví', 0, () => 0)
  expect(start).toHaveLength('Aria mluví'.length)
  expect(start[4]).toBe(' ')
  expect(start).not.toBe('Aria mluví')
  expect(scrambleFrame('Aria mluví', 0.5, () => 0).startsWith('Aria')).toBe(true)
  expect(scrambleFrame('Aria mluví', 1, () => 0)).toBe('Aria mluví')
})
