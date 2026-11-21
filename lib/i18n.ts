// Languages and the public URL scheme. Czech keeps its unprefixed addresses;
// English and German live under /en and /de with their own page names. Inside
// the app every route is /<locale>/<Czech name> (see proxy.ts).

export const LOCALES = ['cs', 'en', 'de'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'cs'

export const LOCALE_NAMES: Record<Locale, string> = { cs: 'Čeština', en: 'English', de: 'Deutsch' }
export const OG_LOCALES: Record<Locale, string> = { cs: 'cs_CZ', en: 'en_US', de: 'de_DE' }

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value)
}

export type Route =
  | { name: 'home' }
  | { name: 'aria' }
  | { name: 'privacy' }
  | { name: 'project'; slug: string }

const PROJECTS = 'projekty'
const PRIVACY = 'ochrana-osobnich-udaju'

/** Public name of each internal (Czech) first path segment that is translated. */
export const LOCALIZED_SEGMENTS: Record<Locale, Record<string, string>> = {
  cs: {},
  en: { [PROJECTS]: 'projects', [PRIVACY]: 'privacy' },
  de: { [PROJECTS]: 'projekte', [PRIVACY]: 'datenschutz' },
}

const split = (pathname: string) => pathname.split('/').filter(Boolean)
const join = (segments: string[]) => `/${segments.join('/')}`

const internalName = (locale: Locale, segment: string) =>
  Object.keys(LOCALIZED_SEGMENTS[locale]).find((name) => LOCALIZED_SEGMENTS[locale][name] === segment) ?? segment

function routeSegments(route: Route): string[] {
  switch (route.name) {
    case 'home':
      return []
    case 'aria':
      return ['aria']
    case 'privacy':
      return [PRIVACY]
    case 'project':
      return [PROJECTS, route.slug]
  }
}

function routeOf(segments: string[]): Route {
  const [first, second, ...rest] = segments
  if (first === 'aria' && second === undefined) return { name: 'aria' }
  if (first === PRIVACY && second === undefined) return { name: 'privacy' }
  if (first === PROJECTS && second !== undefined && rest.length === 0) return { name: 'project', slug: second }
  return { name: 'home' }
}

/** The language a path belongs to; paths without a language prefix are Czech. */
export function localeOfPath(pathname: string): Locale {
  const [first] = split(pathname)
  return isLocale(first) ? first : DEFAULT_LOCALE
}

/** /cs/aria → /aria, /en/projekty/x → /en/projects/x: the address visitors see. */
export function toPublicPath(internalPath: string): string {
  const [locale, head, ...tail] = split(internalPath)
  if (!isLocale(locale)) return join(split(internalPath))
  const names = LOCALIZED_SEGMENTS[locale]
  // Own names only: a path such as /en/constructor must not pick up Object's.
  const rest = head === undefined ? [] : [Object.hasOwn(names, head) ? names[head] : head, ...tail]
  return join(locale === DEFAULT_LOCALE ? rest : [locale, ...rest])
}

/** /aria → /cs/aria, /en/projects/x → /en/projekty/x: the route inside app/[lang]. */
export function toInternalPath(publicPath: string): string {
  const segments = split(publicPath)
  const locale = localeOfPath(publicPath)
  const [head, ...tail] = isLocale(segments[0]) ? segments.slice(1) : segments
  return join(head === undefined ? [locale] : [locale, internalName(locale, head), ...tail])
}

/** The public path of a page in a language. Append `#id` or `?query` as needed. */
export function localizedPath(locale: Locale, route: Route): string {
  return toPublicPath(join([locale, ...routeSegments(route)]))
}

/** The same page in another language; a path that is no known page leads to that language's home. */
export function switchLocalePath(publicPathname: string, toLocale: Locale): string {
  const [, ...segments] = split(toInternalPath(publicPathname))
  return localizedPath(toLocale, routeOf(segments))
}

export type PluralForms = { one: string; other: string; few?: string; many?: string }

/** Fills `{name}` placeholders in a dictionary string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match))
}

/** Picks the plural form the language uses for `count` and fills in `{count}`. */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const form = forms[new Intl.PluralRules(locale).select(count) as keyof PluralForms] ?? forms.other
  return format(form, { count })
}
