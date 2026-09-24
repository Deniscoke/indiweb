// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { aria } from '@/content/aria'

it('presents Aria as our own product with links to its page and demo', () => {
  const { container } = render(<AriaTeaser />)
  expect(container.querySelector('section#aria')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: 'Aria — náš AI hlasový agent' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Více o Arii' }).getAttribute('href')).toBe('/aria')
  const demo = screen.getByRole('link', { name: /Vyzkoušet Ariu/ })
  expect(demo.getAttribute('href')).toBe(aria.url)
  expect(demo.getAttribute('target')).toBe('_blank')
})

it('shows the speaking dot grid next to the pitch', () => {
  const { container } = render(<AriaTeaser />)
  expect(container.querySelector('canvas[aria-hidden="true"]')).not.toBeNull()
})
