// @vitest-environment jsdom
import { act, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { SplatShowcase } from '@/components/home/splat-showcase'
import { cs } from '@/content/locales/cs'
import { splatScene } from '@/content/splat'

it('is reachable as the #splaty section with its own heading', () => {
  const { container } = renderWithI18n(<SplatShowcase />)
  expect(container.querySelector('section#splaty')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: cs.splat.title })).toBeTruthy()
})

it('embeds the live Splatoo scene, loaded lazily and allowed to go fullscreen', () => {
  const { container } = renderWithI18n(<SplatShowcase />)
  const frame = container.querySelector('iframe')!
  expect(frame.getAttribute('src')).toBe(splatScene.embedUrl)
  expect(frame.getAttribute('title')).toBe(cs.splat.sceneTitle)
  expect(frame.getAttribute('loading')).toBe('lazy')
  expect(frame.getAttribute('allow')).toContain('fullscreen')
  expect(frame.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin')
})

it('tells what we build together with Splatoo', () => {
  renderWithI18n(<SplatShowcase />)
  for (const item of cs.splat.collaboration) expect(screen.getByText(item)).toBeTruthy()
})

it('opens the full presentation in a new window', () => {
  renderWithI18n(<SplatShowcase />)
  const link = screen.getByRole('link', { name: /Otevřít ve Splatoo/ })
  expect(link.getAttribute('href')).toBe(splatScene.url)
  expect(link.getAttribute('target')).toBe('_blank')
})

it('loads the heavy 3D embed only as the visitor approaches it', () => {
  let reveal: (entries: { isIntersecting: boolean }[]) => void = () => {}
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(
      class {
        constructor(callback: typeof reveal) {
          reveal = callback
        }
        observe() {}
        disconnect() {}
      },
    ),
  )
  const { container } = renderWithI18n(<SplatShowcase />)
  expect(container.querySelector('iframe')).toBeNull()
  act(() => reveal([{ isIntersecting: true }]))
  expect(container.querySelector('iframe')?.getAttribute('src')).toBe(splatScene.embedUrl)
  vi.unstubAllGlobals()
})
