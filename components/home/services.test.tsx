// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { Services } from '@/components/home/services'
import { cs } from '@/content/locales/cs'
import { localizedServices } from '@/content/services'

const services = localizedServices(cs)

it('shows the web first, then the other services', () => {
  renderWithI18n(<Services />)
  expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
    'Weby na míru',
    '3D a Gaussian splaty',
    'AI agenti a integrace',
    'Konzultace',
  ])
})

it('lists every point of every service without any interaction', () => {
  renderWithI18n(<Services />)
  for (const service of services) {
    for (const point of service.points) expect(screen.getByText(point)).toBeTruthy()
  }
})

it('is reachable as the #sluzby section', () => {
  const { container } = renderWithI18n(<Services />)
  expect(container.querySelector('section#sluzby')).not.toBeNull()
})

it('keeps the static layout when the scroll story does not run', () => {
  const { container } = renderWithI18n(<Services />)
  expect(container.querySelector('[data-stage]')?.hasAttribute('data-staged')).toBe(false)
})

it('draws a numbered index of the services that screen readers skip (the panels carry the headings)', () => {
  const { container } = renderWithI18n(<Services />)
  const index = container.querySelector('[data-index]')
  expect(index?.getAttribute('aria-hidden')).toBe('true')
  const items = [...(index?.querySelectorAll('[data-index-item]') ?? [])].map((item) => item.textContent)
  expect(items).toEqual(services.map((service, i) => `0${i + 1}${service.title}`))
})
