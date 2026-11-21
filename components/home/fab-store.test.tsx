// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { FabStore } from '@/components/home/fab-store'
import { FAB_STORE_URL, fabListings, localizedFabListings } from '@/content/fab'
import { cs } from '@/content/locales/cs'

const featured = localizedFabListings(cs).filter((listing) => listing.featured)

it('is reachable as the #fab section with its own heading', () => {
  const { container } = renderWithI18n(<FabStore />)
  expect(container.querySelector('section#fab')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: cs.fab.title })).toBeTruthy()
})

it('shows a card for every featured listing, linking to it on Fab in a new window', () => {
  renderWithI18n(<FabStore />)
  for (const listing of featured) {
    const heading = screen.getByRole('heading', { level: 3, name: listing.title })
    const link = heading.closest('a')!
    expect(link.getAttribute('href')).toBe(listing.url)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(within(link).getByText(listing.kind)).toBeTruthy()
  }
})

it('counts every listing in the store and links to the whole store', () => {
  renderWithI18n(<FabStore />)
  expect(screen.getByText(`${fabListings.length} produktů na Fabu`)).toBeTruthy()
  const store = screen.getByRole('link', { name: /Celý obchod na Fabu/ })
  expect(store.getAttribute('href')).toBe(FAB_STORE_URL)
  expect(store.getAttribute('target')).toBe('_blank')
})

it('keeps the decorative stage pieces away from screen readers', () => {
  const { container } = renderWithI18n(<FabStore />)
  expect(container.querySelector('[data-status]')?.getAttribute('aria-hidden')).toBe('true')
  expect(container.querySelector('[data-beam]')?.getAttribute('aria-hidden')).toBe('true')
})
