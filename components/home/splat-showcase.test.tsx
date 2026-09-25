// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { SplatShowcase } from '@/components/home/splat-showcase'
import { splatShowcase } from '@/content/splat'

it('is reachable as the #splaty section with its own heading', () => {
  const { container } = render(<SplatShowcase />)
  expect(container.querySelector('section#splaty')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: splatShowcase.title })).toBeTruthy()
})

it('embeds the live Splatoo scene, loaded lazily and allowed to go fullscreen', () => {
  const { container } = render(<SplatShowcase />)
  const frame = container.querySelector('iframe')!
  expect(frame.getAttribute('src')).toBe(splatShowcase.scene.embedUrl)
  expect(frame.getAttribute('title')).toBe(splatShowcase.scene.title)
  expect(frame.getAttribute('loading')).toBe('lazy')
  expect(frame.getAttribute('allow')).toContain('fullscreen')
  expect(frame.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin')
})

it('tells what we build together with Splatoo', () => {
  render(<SplatShowcase />)
  for (const item of splatShowcase.collaboration) expect(screen.getByText(item)).toBeTruthy()
})

it('opens the full presentation in a new window', () => {
  render(<SplatShowcase />)
  const link = screen.getByRole('link', { name: /Otevřít ve Splatoo/ })
  expect(link.getAttribute('href')).toBe(splatShowcase.scene.url)
  expect(link.getAttribute('target')).toBe('_blank')
})
