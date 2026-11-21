import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  format,
  isLocale,
  LOCALE_NAMES,
  LOCALES,
  localeOfPath,
  localizedPath,
  OG_LOCALES,
  plural,
  switchLocalePath,
  toInternalPath,
  toPublicPath,
  type Locale,
  type Route,
} from '@/lib/i18n'

describe('locales', () => {
  it('are Czech (the default), English and German', () => {
    expect(LOCALES).toEqual(['cs', 'en', 'de'])
    expect(DEFAULT_LOCALE).toBe('cs')
    expect(LOCALE_NAMES).toEqual({ cs: 'Čeština', en: 'English', de: 'Deutsch' })
    expect(OG_LOCALES).toEqual({ cs: 'cs_CZ', en: 'en_US', de: 'de_DE' })
  })

  it.each(['cs', 'en', 'de'])('knows %s', (value) => {
    expect(isLocale(value)).toBe(true)
  })

  it.each(['fr', 'EN', '', 'cs-CZ', null, undefined, 5, 'constructor', '__proto__'])('rejects %s', (value) => {
    expect(isLocale(value)).toBe(false)
  })
})

const PAGES: [Route, Record<Locale, string>][] = [
  [{ name: 'home' }, { cs: '/', en: '/en', de: '/de' }],
  [{ name: 'aria' }, { cs: '/aria', en: '/en/aria', de: '/de/aria' }],
  [
    { name: 'privacy' },
    { cs: '/ochrana-osobnich-udaju', en: '/en/privacy', de: '/de/datenschutz' },
  ],
  [
    { name: 'project', slug: 'elevator-servis' },
    {
      cs: '/projekty/elevator-servis',
      en: '/en/projects/elevator-servis',
      de: '/de/projekte/elevator-servis',
    },
  ],
]

describe('localizedPath', () => {
  it.each(PAGES)('gives %o its public address in every language', (route, paths) => {
    for (const locale of LOCALES) expect(localizedPath(locale, route)).toBe(paths[locale])
  })
})

describe('switchLocalePath', () => {
  it.each(PAGES)('finds the same page as %o in every other language', (_route, paths) => {
    for (const from of LOCALES) {
      for (const to of LOCALES) expect(switchLocalePath(paths[from], to)).toBe(paths[to])
    }
  })

  it.each([
    ['/neco', 'en', '/en'],
    ['/en/nonsense', 'cs', '/'],
    ['/en/aria/extra', 'de', '/de'],
    ['/de/projekte', 'en', '/en'],
    ['/projects/elevator-servis', 'de', '/de'],
  ] as const)('sends the unknown %s to the home page of %s', (path, to, expected) => {
    expect(switchLocalePath(path, to)).toBe(expected)
  })

  it('ignores a trailing slash', () => {
    expect(switchLocalePath('/en/aria/', 'cs')).toBe('/aria')
  })
})

describe('localeOfPath', () => {
  it.each([
    ['/', 'cs'],
    ['/aria', 'cs'],
    ['/projekty/elevator-servis', 'cs'],
    ['/cs/aria', 'cs'],
    ['/en', 'en'],
    ['/en/projects/x', 'en'],
    ['/de/datenschutz', 'de'],
    ['/english', 'cs'],
    ['/fr', 'cs'],
  ] as const)('%s is %s', (path, locale) => {
    expect(localeOfPath(path)).toBe(locale)
  })
})

describe('public and internal paths', () => {
  it.each([
    ['/', '/cs'],
    ['/aria', '/cs/aria'],
    ['/projekty/x', '/cs/projekty/x'],
    ['/en', '/en'],
    ['/en/aria', '/en/aria'],
    ['/en/projects/x', '/en/projekty/x'],
    ['/en/privacy', '/en/ochrana-osobnich-udaju'],
    ['/de/projekte/x', '/de/projekty/x'],
    ['/de/datenschutz', '/de/ochrana-osobnich-udaju'],
  ])('%s is served by %s, and back', (publicPath, internalPath) => {
    expect(toInternalPath(publicPath)).toBe(internalPath)
    expect(toPublicPath(internalPath)).toBe(publicPath)
  })

  it('translates only the names of its own language', () => {
    expect(toInternalPath('/de/projects/x')).toBe('/de/projects/x')
    expect(toInternalPath('/privacy')).toBe('/cs/privacy')
  })
})

describe('format', () => {
  it('fills in named values and leaves unknown placeholders alone', () => {
    expect(format('Úvodní obrazovka webu {title}', { title: 'Esencia Viva' })).toBe('Úvodní obrazovka webu Esencia Viva')
    expect(format('{a} a {b}', { a: 1 })).toBe('1 a {b}')
  })
})

describe('plural', () => {
  const czech = { one: '{count} produkt', few: '{count} produkty', other: '{count} produktů' }
  const english = { one: '{count} product', other: '{count} products' }

  it('follows the Czech rule: one, two to four, five and more', () => {
    expect([1, 2, 4, 5, 15, 0].map((n) => plural('cs', n, czech))).toEqual([
      '1 produkt',
      '2 produkty',
      '4 produkty',
      '5 produktů',
      '15 produktů',
      '0 produktů',
    ])
  })

  it('follows the English and German rule: one, otherwise many', () => {
    expect([1, 2, 15].map((n) => plural('en', n, english))).toEqual(['1 product', '2 products', '15 products'])
    expect(plural('de', 1, english)).toBe('1 product')
    expect(plural('de', 3, english)).toBe('3 products')
  })

  it('falls back to "other" when a language has no form of its own for the number', () => {
    expect(plural('cs', 3, english)).toBe('3 products')
  })
})
