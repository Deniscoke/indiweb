import { DEFAULT_LOCALE, isLocale, LOCALIZED_SEGMENTS, toInternalPath, toPublicPath } from '@/lib/i18n'

export type ProxyDecision =
  | { action: 'next' }
  | { action: 'rewrite'; pathname: string }
  | { action: 'redirect'; pathname: string }

/**
 * What proxy.ts does with a request path, so that every page has exactly one
 * public address: Czech unprefixed, English and German under their own names.
 */
export function routeRequest(pathname: string): ProxyDecision {
  const [first, second] = pathname.split('/').filter(Boolean)

  // Unprefixed paths are Czech pages, which live under /cs inside the app.
  if (!isLocale(first)) return { action: 'rewrite', pathname: toInternalPath(pathname) }

  // /cs/... is the internal address of a Czech page; visitors get the plain one.
  if (first === DEFAULT_LOCALE) return { action: 'redirect', pathname: toPublicPath(pathname) }

  const names = LOCALIZED_SEGMENTS[first]
  // The Czech folder name under /en or /de: send it to the translated address.
  if (second !== undefined && Object.hasOwn(names, second)) return { action: 'redirect', pathname: toPublicPath(pathname) }
  // The translated name: serve the Czech-named route behind it.
  if (second !== undefined && Object.values(names).includes(second)) {
    return { action: 'rewrite', pathname: toInternalPath(pathname) }
  }
  return { action: 'next' }
}
