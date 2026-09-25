// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'
import { site } from '@/content/site'

it('introduces Aria with its tagline', () => {
  render(<AriaPage />)
  expect(screen.getByRole('heading', { level: 1, name: 'Aria' })).toBeTruthy()
  expect(screen.getByText(aria.tagline, { selector: '.sr-only' })).toBeTruthy()
})

it('lists capabilities, audience and the rollout steps', () => {
  render(<AriaPage />)
  for (const text of [...aria.capabilities, ...aria.audience]) expect(screen.getByText(text)).toBeTruthy()
  for (const step of aria.rollout) {
    expect(screen.getByRole('heading', { level: 3, name: step.title })).toBeTruthy()
  }
})

it('links to the inquiry form with AI preselected, and never away from the site', () => {
  const { container } = render(<AriaPage voiceDemo />)
  const ctas = screen.getAllByRole('link', { name: 'Chci Ariu pro svou firmu' })
  expect(ctas.length).toBeGreaterThan(0)
  for (const cta of ctas) expect(cta.getAttribute('href')).toBe('/?sluzba=ai#kontakt')
  expect(container.querySelector('a[target="_blank"]')).toBeNull()
})

it('can be tried live on the page once the voice demo is configured', () => {
  const { container } = render(<AriaPage voiceDemo />)
  const tryIt = screen.getByRole('link', { name: 'Vyzkoušet Ariu' })
  const target = container.querySelector(tryIt.getAttribute('href') ?? '-')
  expect(target?.querySelector('button')?.textContent).toMatch(/Promluvit s Ariou/)
})

it('describes Aria to search engines as a service by IndiWeb', () => {
  const { container } = render(<AriaPage />)
  const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}')
  expect(data['@type']).toBe('Service')
  expect(data.name).toBe(aria.name)
  expect(data.description).toBe(aria.description)
  expect(data.provider).toMatchObject({ '@type': 'Organization', name: site.name })
})
