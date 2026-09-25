// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { FinaleHeading, shardPaths } from '@/components/story/finale-heading'

it('reads as one heading to assistive technology', () => {
  render(<FinaleHeading id="kontakt-nadpis" text="Pojďme do toho." />)
  const heading = screen.getByRole('heading', { level: 2, name: 'Pojďme do toho.' })
  expect(heading.id).toBe('kontakt-nadpis')
})

it('splits the visible text into lit characters, word by word', () => {
  const { container } = render(<FinaleHeading id="x" text="Pojďme do toho." />)
  const chars = container.querySelectorAll('[data-char]')
  expect([...chars].map((char) => char.textContent).join('')).toBe('Pojďmedotoho.')
  expect([...chars].every((char) => char.classList.contains('lit'))).toBe(true)
  expect(container.querySelectorAll('[data-word]')).toHaveLength(3)
})

it('spreads the shards all around the heading, the same way on every render', () => {
  const paths = shardPaths(12)
  expect(paths).toHaveLength(12)
  expect(shardPaths(12)).toEqual(paths)
  // Every quadrant gets some light.
  const quadrants = new Set(paths.map(({ angle }) => Math.floor((((angle % 360) + 360) % 360) / 90)))
  expect(quadrants.size).toBe(4)
  for (const { distance, length } of paths) {
    expect(distance).toBeGreaterThan(0)
    expect(length).toBeGreaterThan(0)
  }
})
