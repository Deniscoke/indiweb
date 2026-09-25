// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Services } from '@/components/home/services'
import { services } from '@/content/services'

it('shows the web first, then the other services', () => {
  render(<Services />)
  expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
    'Weby na míru',
    '3D a Gaussian splaty',
    'AI agenti a integrace',
    'Konzultace',
  ])
})

it('lists every point of every service without any interaction', () => {
  render(<Services />)
  for (const service of services) {
    for (const point of service.points) expect(screen.getByText(point)).toBeTruthy()
  }
})

it('is reachable as the #sluzby section', () => {
  const { container } = render(<Services />)
  expect(container.querySelector('section#sluzby')).not.toBeNull()
})

it('keeps the static layout when the scroll story does not run', () => {
  const { container } = render(<Services />)
  expect(container.querySelector('[data-stage]')?.hasAttribute('data-staged')).toBe(false)
})
