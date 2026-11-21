// @vitest-environment jsdom
import { fireEvent, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '@/test/render'

const { segments } = vi.hoisted(() => ({ segments: vi.fn((): string[] => []) }))
vi.mock('next/navigation', () => ({ useSelectedLayoutSegments: segments }))

import { LanguageSwitcher } from '@/components/layout/language-switcher'

// One navigation is rendered, whatever its label is in the page's language.
const links = () => within(screen.getByRole('navigation')).getAllByRole('link')
const hrefs = () => links().map((link) => link.getAttribute('href'))

beforeEach(() => {
  segments.mockReturnValue([])
})

describe('LanguageSwitcher', () => {
  it('offers Czech, English and German, each marked with its language', () => {
    renderWithI18n(<LanguageSwitcher />)
    expect(links().map((link) => link.textContent)).toEqual(['cs', 'en', 'de'])
    expect(links().map((link) => link.getAttribute('hreflang'))).toEqual(['cs', 'en', 'de'])
    expect(links().map((link) => link.getAttribute('lang'))).toEqual(['cs', 'en', 'de'])
    expect(screen.getByRole('link', { name: 'Čeština' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'English' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Deutsch' })).toBeTruthy()
  })

  it('marks the language of the page as current, and only that one', () => {
    renderWithI18n(<LanguageSwitcher />, 'de')
    expect(links().map((link) => link.getAttribute('aria-current'))).toEqual([null, null, 'true'])
    expect(screen.getByRole('link', { name: 'Deutsch' }).className).toContain('text-accent')
    expect(screen.getByRole('link', { name: 'English' }).className).not.toContain('text-accent')
  })

  it('links the home page to the other home pages', () => {
    renderWithI18n(<LanguageSwitcher />)
    expect(hrefs()).toEqual(['/', '/en', '/de'])
  })

  it('links a page to the same page in each language, under its translated address', () => {
    segments.mockReturnValue(['projekty', 'elevator-servis'])
    renderWithI18n(<LanguageSwitcher />, 'en')
    expect(hrefs()).toEqual([
      '/projekty/elevator-servis',
      '/en/projects/elevator-servis',
      '/de/projekte/elevator-servis',
    ])
  })

  it.each([
    [['aria'], ['/aria', '/en/aria', '/de/aria']],
    [['ochrana-osobnich-udaju'], ['/ochrana-osobnich-udaju', '/en/privacy', '/de/datenschutz']],
    // A 404 has no counterpart: the languages lead home.
    [['neco', 'jineho'], ['/', '/en', '/de']],
  ])('from %j leads to %j', (current, expected) => {
    segments.mockReturnValue(current)
    renderWithI18n(<LanguageSwitcher />, 'de')
    expect(hrefs()).toEqual(expected)
  })

  it('tells its parent when a language is chosen, so an open menu can close', () => {
    const onNavigate = vi.fn()
    renderWithI18n(<LanguageSwitcher onNavigate={onNavigate} />)
    // jsdom does not navigate; the click only has to reach the handler.
    const link = screen.getByRole('link', { name: 'English' })
    link.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(link)
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
