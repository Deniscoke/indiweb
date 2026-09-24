// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { SectionHeading } from '@/components/ui/section-heading'

it('renders an h2 with the given id and the lead', () => {
  render(<SectionHeading id="sluzby-nadpis" title="Web je základ." lead="Úvod" />)
  const heading = screen.getByRole('heading', { level: 2, name: 'Web je základ.' })
  expect(heading.id).toBe('sluzby-nadpis')
  expect(screen.getByText('Úvod')).toBeTruthy()
})

it('reveals the heading with the light sweep', () => {
  render(<SectionHeading id="x" title="Titulek" />)
  expect(screen.getByRole('heading', { name: 'Titulek' }).closest('.reveal')).not.toBeNull()
})
