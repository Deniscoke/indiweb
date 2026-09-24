// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
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

it('lists every point of every service', () => {
  render(<Services />)
  for (const service of services) {
    for (const point of service.points) expect(screen.getByText(point)).toBeTruthy()
  }
})

it('is reachable as the #sluzby section', () => {
  const { container } = render(<Services />)
  expect(container.querySelector('section#sluzby')).not.toBeNull()
})

it('opens the featured service and toggles the others on click', () => {
  render(<Services />)
  const web = screen.getByRole('button', { name: 'Weby na míru' })
  const ai = screen.getByRole('button', { name: 'AI agenti a integrace' })
  expect(web.getAttribute('aria-expanded')).toBe('true')
  expect(ai.getAttribute('aria-expanded')).toBe('false')

  fireEvent.click(ai)
  expect(ai.getAttribute('aria-expanded')).toBe('true')
  expect(document.getElementById(ai.getAttribute('aria-controls') as string)?.hidden).toBe(false)

  fireEvent.click(ai)
  expect(ai.getAttribute('aria-expanded')).toBe('false')
})
