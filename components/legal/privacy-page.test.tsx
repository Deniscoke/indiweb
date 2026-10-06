// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { PrivacyPage } from '@/components/legal/privacy-page'
import { privacy } from '@/content/privacy'
import { site } from '@/content/site'
import { TRANSCRIPT_RETENTION_DAYS } from '@/lib/voice-agent'

const text = () => document.body.textContent ?? ''

it('is one page titled Ochrana osobních údajů, with a heading per section', () => {
  render(<PrivacyPage />)
  expect(screen.getByRole('heading', { level: 1, name: 'Ochrana osobních údajů' })).toBeTruthy()
  for (const section of privacy.sections) {
    expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeTruthy()
  }
})

it('names the controller and how to reach him', () => {
  render(<PrivacyPage />)
  expect(text()).toContain(privacy.controller.name)
  expect(screen.getAllByRole('link', { name: site.email })[0].getAttribute('href')).toBe(`mailto:${site.email}`)
})

it('names every service that touches visitors’ data', () => {
  render(<PrivacyPage />)
  for (const name of ['Vercel', 'Resend', 'Google', 'ElevenLabs', 'Splatoo']) expect(text()).toContain(name)
})

it('states the transcript retention the voice agent is really set to', () => {
  render(<PrivacyPage />)
  expect(text()).toContain(`${TRANSCRIPT_RETENTION_DAYS} dní`)
})

it('points to the Czech data protection authority', () => {
  render(<PrivacyPage />)
  expect(text()).toContain('Úřad pro ochranu osobních údajů')
  expect(screen.getByRole('link', { name: /uoou\.gov\.cz/ }).getAttribute('href')).toBe('https://uoou.gov.cz')
})

it('says honestly that visits are measured, without cookies', () => {
  render(<PrivacyPage />)
  expect(text()).toContain('Vercel Web Analytics')
  expect(text()).not.toContain('ani analytické')
})
