// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'

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

it('links to the live demo and to the inquiry form with AI preselected', () => {
  render(<AriaPage />)
  const demo = screen.getByRole('link', { name: /Vyzkoušet Ariu/ })
  expect(demo.getAttribute('href')).toBe(aria.url)
  expect(demo.getAttribute('target')).toBe('_blank')
  const ctas = screen.getAllByRole('link', { name: 'Chci Ariu pro svou firmu' })
  expect(ctas.length).toBeGreaterThan(0)
  for (const cta of ctas) expect(cta.getAttribute('href')).toBe('/?sluzba=ai#kontakt')
})
