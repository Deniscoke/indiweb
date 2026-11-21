// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { Hero } from '@/components/home/hero'

it('states what IndiWeb does in one heading', () => {
  renderWithI18n(<Hero />)
  expect(
    screen.getByRole('heading', { level: 1, name: 'Navrhneme. Postavíme. Rozsvítíme.' }),
  ).toBeTruthy()
})

it('lights the heading lines with the pointer light', () => {
  const { container } = renderWithI18n(<Hero />)
  expect(container.querySelectorAll('h1 .lit')).toHaveLength(3)
})

it('points to contact and projects', () => {
  renderWithI18n(<Hero />)
  expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('#kontakt')
  expect(screen.getByRole('link', { name: 'Ukázky práce' }).getAttribute('href')).toBe('#projekty')
})
