// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { Footer } from '@/components/layout/footer'
import { en } from '@/content/locales/en'

it('shows the current year and the contact e-mail', () => {
  renderWithI18n(<Footer locale="cs" />)
  expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} IndiWeb`))).toBeTruthy()
  expect(screen.getByRole('link', { name: 'info.indiweb@gmail.com' }).getAttribute('href')).toBe(
    'mailto:info.indiweb@gmail.com',
  )
})

it('links to the privacy page', () => {
  renderWithI18n(<Footer locale="cs" />)
  expect(screen.getByRole('link', { name: 'Ochrana osobních údajů' }).getAttribute('href')).toBe('/ochrana-osobnich-udaju')
})

it('keeps visitors in their language', () => {
  renderWithI18n(<Footer locale="en" />, 'en')
  expect(screen.getByRole('link', { name: en.footer.privacy }).getAttribute('href')).toBe('/en/privacy')
  expect(screen.getByRole('link', { name: en.nav.kontakt }).getAttribute('href')).toBe('/en#kontakt')
})
