// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { AriaTeaser } from '@/components/home/aria-teaser'

it('presents Aria as our own product with a link to its page, never sending visitors away', () => {
  const { container } = renderWithI18n(<AriaTeaser voiceDemo />)
  expect(container.querySelector('section#aria')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: 'Aria — náš AI hlasový agent' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Více o Arii' }).getAttribute('href')).toBe('/aria')
  expect(container.querySelector('a[target="_blank"]')).toBeNull()
})

it('keeps German visitors on the German Aria page', () => {
  renderWithI18n(<AriaTeaser />, 'de')
  expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe('/de/aria')
})

it('shows the speaking dot grid next to the pitch', () => {
  const { container } = renderWithI18n(<AriaTeaser />)
  expect(container.querySelector('canvas[aria-hidden="true"]')).not.toBeNull()
})

it('lets visitors try Aria right here once the voice demo is configured', () => {
  const { container } = renderWithI18n(<AriaTeaser voiceDemo />)
  const tryIt = screen.getByRole('link', { name: 'Vyzkoušet Ariu' })
  const target = container.querySelector(tryIt.getAttribute('href') ?? '-')
  expect(target?.querySelector('button')?.textContent).toMatch(/Promluvit s Ariou/)
})

it('offers no call and no try-it link before the voice demo is configured', () => {
  renderWithI18n(<AriaTeaser />)
  expect(screen.queryByRole('button', { name: /Promluvit s Ariou/ })).toBeNull()
  expect(screen.queryByRole('link', { name: 'Vyzkoušet Ariu' })).toBeNull()
})
