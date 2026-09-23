// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Hero } from '@/components/home/hero'

it('introduces IndiWeb and points to contact and projects', () => {
  render(<Hero />)
  expect(
    screen.getByRole('heading', { level: 1, name: /Weby a digitální zážitky, které\s+prodávají/ }),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('#kontakt')
  expect(screen.getByRole('link', { name: 'Ukázky práce' }).getAttribute('href')).toBe('#projekty')
})
