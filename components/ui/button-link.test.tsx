// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ButtonLink } from '@/components/ui/button-link'

it('renders an internal link in the same tab', () => {
  render(<ButtonLink href="/aria">Více o Arii</ButtonLink>)
  const link = screen.getByRole('link', { name: 'Více o Arii' })
  expect(link.getAttribute('href')).toBe('/aria')
  expect(link.getAttribute('target')).toBeNull()
})

it('opens an external link in a new tab and says so', () => {
  render(
    <ButtonLink href="https://aria-eta-five.vercel.app" external withArrow>
      Vyzkoušet Ariu
    </ButtonLink>,
  )
  const link = screen.getByRole('link', { name: 'Vyzkoušet Ariu (otevře se v novém okně)' })
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toBe('noopener noreferrer')
})
