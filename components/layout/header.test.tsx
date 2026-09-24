// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/layout/header'
import { navigation } from '@/content/site'

const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'Otevřít menu' }))
const menu = () => screen.queryByRole('dialog', { name: 'Menu' })

describe('Header', () => {
  it('links the logo home and offers a contact link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'IndiWeb' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('/#kontakt')
  })

  it('opens a full-screen menu with every section', () => {
    render(<Header />)
    expect(menu()).toBeNull()
    openMenu()
    const dialog = menu() as HTMLElement
    const nav = within(dialog).getByRole('navigation', { name: 'Hlavní navigace' })
    for (const item of navigation) {
      expect(within(nav).getByRole('link', { name: item.label }).getAttribute('href')).toBe(item.href)
    }
    expect(screen.getByRole('button', { name: 'Zavřít menu' }).getAttribute('aria-expanded')).toBe('true')
  })

  it('moves focus into the menu when it opens', () => {
    render(<Header />)
    openMenu()
    expect(document.activeElement).toBe(within(menu() as HTMLElement).getAllByRole('link')[0])
  })

  it('closes the menu when a link is chosen', () => {
    render(<Header />)
    openMenu()
    fireEvent.click(within(menu() as HTMLElement).getByRole('link', { name: 'Projekty' }))
    expect(menu()).toBeNull()
  })

  it('closes the menu on Escape and returns focus to the button', () => {
    render(<Header />)
    openMenu()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(menu()).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Otevřít menu' }))
  })

  it('marks itself as scrolled after the page moves', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header') as HTMLElement
    expect(header.dataset.scrolled).toBe('false')
    Object.defineProperty(window, 'scrollY', { value: 120, configurable: true })
    fireEvent.scroll(window)
    expect(header.dataset.scrolled).toBe('true')
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })
})
