// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AriaTeaser } from '@/components/home/aria-teaser'

it('presents Aria as our own product with a link to its page, never sending visitors away', () => {
  const { container } = render(<AriaTeaser voiceDemo />)
  expect(container.querySelector('section#aria')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: 'Aria — náš AI hlasový agent' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Více o Arii' }).getAttribute('href')).toBe('/aria')
  expect(container.querySelector('a[target="_blank"]')).toBeNull()
})

it('shows the speaking dot grid next to the pitch', () => {
  const { container } = render(<AriaTeaser />)
  expect(container.querySelector('canvas[aria-hidden="true"]')).not.toBeNull()
})

it('lets visitors try Aria right here once the voice demo is configured', () => {
  const { container } = render(<AriaTeaser voiceDemo />)
  const tryIt = screen.getByRole('link', { name: 'Vyzkoušet Ariu' })
  const target = container.querySelector(tryIt.getAttribute('href') ?? '-')
  expect(target?.querySelector('button')?.textContent).toMatch(/Promluvit s Ariou/)
})

it('offers no call and no try-it link before the voice demo is configured', () => {
  render(<AriaTeaser />)
  expect(screen.queryByRole('button', { name: /Promluvit s Ariou/ })).toBeNull()
  expect(screen.queryByRole('link', { name: 'Vyzkoušet Ariu' })).toBeNull()
})
