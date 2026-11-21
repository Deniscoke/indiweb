import { describe, expect, it } from 'vitest'
import { routeRequest } from '@/lib/proxy-route'
import { config } from '@/proxy'

describe('routeRequest', () => {
  it.each([
    ['/cs', '/'],
    ['/cs/', '/'],
    ['/cs/aria', '/aria'],
    ['/cs/projekty/elevator-servis', '/projekty/elevator-servis'],
    ['/cs/ochrana-osobnich-udaju', '/ochrana-osobnich-udaju'],
  ])('redirects the internal Czech address %s to %s', (from, to) => {
    expect(routeRequest(from)).toEqual({ action: 'redirect', pathname: to })
  })

  it.each([
    ['/en/projects/elevator-servis', '/en/projekty/elevator-servis'],
    ['/en/privacy', '/en/ochrana-osobnich-udaju'],
    ['/de/projekte/elevator-servis', '/de/projekty/elevator-servis'],
    ['/de/datenschutz', '/de/ochrana-osobnich-udaju'],
  ])('serves the translated address %s from %s', (from, to) => {
    expect(routeRequest(from)).toEqual({ action: 'rewrite', pathname: to })
  })

  it.each([
    ['/en/projekty/elevator-servis', '/en/projects/elevator-servis'],
    ['/en/ochrana-osobnich-udaju', '/en/privacy'],
    ['/de/projekty/elevator-servis', '/de/projekte/elevator-servis'],
    ['/de/ochrana-osobnich-udaju', '/de/datenschutz'],
  ])('redirects the Czech name %s to the translated %s, so a page has one address', (from, to) => {
    expect(routeRequest(from)).toEqual({ action: 'redirect', pathname: to })
  })

  it.each([
    ['/', '/cs'],
    ['/aria', '/cs/aria'],
    ['/projekty/elevator-servis', '/cs/projekty/elevator-servis'],
    ['/ochrana-osobnich-udaju', '/cs/ochrana-osobnich-udaju'],
    ['/opengraph-image', '/cs/opengraph-image'],
    // No such language or page: Czech serves its own 404.
    ['/fr', '/cs/fr'],
    ['/projects/elevator-servis', '/cs/projects/elevator-servis'],
    ['/english', '/cs/english'],
  ])('serves the unprefixed %s from %s', (from, to) => {
    expect(routeRequest(from)).toEqual({ action: 'rewrite', pathname: to })
  })

  it.each(['/en', '/de', '/en/aria', '/de/aria', '/en/opengraph-image', '/en/nonsense', '/de/projects/x'])(
    'leaves %s as it is',
    (pathname) => {
      expect(routeRequest(pathname)).toEqual({ action: 'next' })
    },
  )
})

describe('routeRequest with names every object has', () => {
  it.each(['/en/constructor', '/de/toString', '/en/__proto__'])('lets %s through to a plain 404', (pathname) => {
    expect(routeRequest(pathname)).toEqual({ action: 'next' })
  })

  it('keeps such a name as it is when leaving /cs', () => {
    expect(routeRequest('/cs/constructor')).toEqual({ action: 'redirect', pathname: '/constructor' })
  })
})

describe('proxy matcher', () => {
  const [source] = config.matcher
  const matches = (pathname: string) => new RegExp(`^${source}$`).test(pathname)

  it.each(['/', '/aria', '/cs', '/en/projects/elevator-servis', '/de/datenschutz', '/opengraph-image', '/fr'])(
    'runs on the page %s',
    (pathname) => {
      expect(matches(pathname)).toBe(true)
    },
  )

  it.each([
    '/_next/static/chunks/main.js',
    '/_next/image',
    '/_vercel/insights/view',
    '/_vercel/speed-insights/vitals',
    '/robots.txt',
    '/sitemap.xml',
    '/icon.svg',
    '/media/macbook.webp',
    '/projects/elevator-servis.webp',
  ])('skips the file %s', (pathname) => {
    expect(matches(pathname)).toBe(false)
  })
})
