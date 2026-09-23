// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/layout/header'
import { navigation } from '@/content/site'

describe('Header', () => {
  it('links to every home page section', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Hlavní navigace' })
    for (const item of navigation) {
      expect(within(nav).getByRole('link', { name: item.label }).getAttribute('href')).toBe(item.href)
    }
  })

  it('offers a contact call to action', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('/#kontakt')
  })

  it('opens and closes the mobile menu', () => {
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Otevřít menu' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle)
    const mobileNav = screen.getByRole('navigation', { name: 'Mobilní navigace' })
    expect(screen.getByRole('button', { name: 'Zavřít menu' }).getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(within(mobileNav).getByRole('link', { name: 'Projekty' }))
    expect(screen.queryByRole('navigation', { name: 'Mobilní navigace' })).toBeNull()
  })

  it('closes the mobile menu on Escape', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Otevřít menu' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Mobilní navigace' })).toBeNull()
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
