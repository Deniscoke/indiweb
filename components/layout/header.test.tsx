// @vitest-environment jsdom
import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '@/test/render'

const { segments } = vi.hoisted(() => ({ segments: vi.fn((): string[] => []) }))
vi.mock('next/navigation', () => ({ useSelectedLayoutSegments: segments }))

import { Header } from '@/components/layout/header'
import { cs } from '@/content/locales/cs'
import { en } from '@/content/locales/en'
import { NAV_SECTIONS } from '@/content/site'

const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'Otevřít menu' }))
const menu = () => screen.queryByRole('dialog', { name: 'Menu' })

describe('Header', () => {
  it('links the logo home and offers a contact link', () => {
    renderWithI18n(<Header />)
    expect(screen.getByRole('link', { name: 'IndiWeb' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('/#kontakt')
  })

  it('opens a full-screen menu with every section', () => {
    renderWithI18n(<Header />)
    expect(menu()).toBeNull()
    openMenu()
    const dialog = menu() as HTMLElement
    const nav = within(dialog).getByRole('navigation', { name: 'Hlavní navigace' })
    for (const section of NAV_SECTIONS) {
      expect(within(nav).getByRole('link', { name: cs.nav[section] }).getAttribute('href')).toBe(`/#${section}`)
    }
    expect(screen.getByRole('button', { name: 'Zavřít menu' }).getAttribute('aria-expanded')).toBe('true')
  })

  it('moves focus into the menu when it opens', () => {
    renderWithI18n(<Header />)
    openMenu()
    expect(document.activeElement).toBe(within(menu() as HTMLElement).getAllByRole('link')[0])
  })

  it('closes the menu when a link is chosen', () => {
    renderWithI18n(<Header />)
    openMenu()
    fireEvent.click(within(menu() as HTMLElement).getByRole('link', { name: 'Projekty' }))
    expect(menu()).toBeNull()
  })

  it('closes the menu on Escape and returns focus to the button', () => {
    renderWithI18n(<Header />)
    openMenu()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(menu()).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Otevřít menu' }))
  })

  it('keeps English visitors in English', () => {
    renderWithI18n(<Header />, 'en')
    expect(screen.getByRole('link', { name: 'IndiWeb' }).getAttribute('href')).toBe('/en')
    fireEvent.click(screen.getByRole('button', { name: en.header.openMenu }))
    const nav = screen.getByRole('navigation', { name: en.header.mainNav })
    expect(within(nav).getByRole('link', { name: en.nav.projekty }).getAttribute('href')).toBe('/en#projekty')
  })

  it('offers the three languages in the bar and again inside the menu', () => {
    renderWithI18n(<Header />)
    expect(screen.getAllByRole('navigation', { name: cs.header.languages })).toHaveLength(1)
    openMenu()
    expect(within(menu() as HTMLElement).getByRole('navigation', { name: cs.header.languages })).toBeTruthy()
  })

  it('marks itself as scrolled after the page moves', () => {
    const { container } = renderWithI18n(<Header />)
    const header = container.querySelector('header') as HTMLElement
    expect(header.dataset.scrolled).toBe('false')
    Object.defineProperty(window, 'scrollY', { value: 120, configurable: true })
    fireEvent.scroll(window)
    expect(header.dataset.scrolled).toBe('true')
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })
})
