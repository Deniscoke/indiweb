// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { AriaPage } from '@/components/aria/aria-page'
import { cs } from '@/content/locales/cs'

const { aria } = cs

it('introduces Aria with its tagline', () => {
  renderWithI18n(<AriaPage locale="cs" />)
  expect(screen.getByRole('heading', { level: 1, name: 'Aria' })).toBeTruthy()
  expect(screen.getByText(aria.tagline, { selector: '.sr-only' })).toBeTruthy()
})

it('lists capabilities, audience and the rollout steps', () => {
  renderWithI18n(<AriaPage locale="cs" />)
  for (const text of [...aria.capabilities, ...aria.audience]) expect(screen.getByText(text)).toBeTruthy()
  for (const step of aria.rollout) {
    expect(screen.getByRole('heading', { level: 3, name: step.title })).toBeTruthy()
  }
})

it('links to the inquiry form with AI preselected, and never away from the site', () => {
  const { container } = renderWithI18n(<AriaPage locale="cs" voiceDemo />)
  const ctas = screen.getAllByRole('link', { name: 'Chci Ariu pro svou firmu' })
  expect(ctas.length).toBeGreaterThan(0)
  for (const cta of ctas) expect(cta.getAttribute('href')).toBe('/?sluzba=ai#kontakt')
  expect(container.querySelector('a[target="_blank"]')).toBeNull()
})

it('can be tried live on the page once the voice demo is configured', () => {
  const { container } = renderWithI18n(<AriaPage locale="cs" voiceDemo />)
  const tryIt = screen.getByRole('link', { name: 'Vyzkoušet Ariu' })
  const target = container.querySelector(tryIt.getAttribute('href') ?? '-')
  expect(target?.querySelector('button')?.textContent).toMatch(/Promluvit s Ariou/)
})

it('sends English visitors to the English inquiry form', () => {
  renderWithI18n(<AriaPage locale="en" />, 'en')
  const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
  expect(hrefs).toContain('/en?sluzba=ai#kontakt')
})
