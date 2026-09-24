// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Footer } from '@/components/layout/footer'

it('shows the current year and the contact e-mail', () => {
  render(<Footer />)
  expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} IndiWeb`))).toBeTruthy()
  expect(screen.getByRole('link', { name: 'info.indiweb@gmail.com' }).getAttribute('href')).toBe(
    'mailto:info.indiweb@gmail.com',
  )
})
