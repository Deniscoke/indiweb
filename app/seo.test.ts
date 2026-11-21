import { describe, expect, it } from 'vitest'
import nextConfig from '@/next.config'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { FAB_STORE_URL } from '@/content/fab'
import { getDictionary } from '@/content/locales'
import { cs } from '@/content/locales/cs'
import { getPrivacy } from '@/content/locales/privacy'
import { localizedProjects, projects } from '@/content/projects'
import { localizedServices } from '@/content/services'
import { site } from '@/content/site'
import { team } from '@/content/team'
import { LOCALES, OG_LOCALES, type Locale, type Route } from '@/lib/i18n'
import {
  ariaJsonLd,
  homeJsonLd,
  indexableRoutes,
  languageAlternates,
  organizationJsonLd,
  pageMetadata,
  pageUrl,
  privacyJsonLd,
  projectJsonLd,
  shareImagePath,
  type JsonLdGraph,
  type JsonLdNode,
} from '@/lib/seo'

const HREFLANGS = [...LOCALES, 'x-default']
const routes = indexableRoutes()
const label = (route: Route) => (route.name === 'project' ? `project ${route.slug}` : route.name)
const everyPage = routes.flatMap((route) => LOCALES.map((locale) => [locale, label(route), route] as const))
const meta = (locale: Locale, route: Route) => pageMetadata({ locale, title: 'T', description: 'D', route })

describe('indexable pages', () => {
  it('are the home page, Aria, every project and the privacy notice', () => {
    expect(routes).toEqual([
      { name: 'home' },
      { name: 'aria' },
      ...projects.map((project) => ({ name: 'project', slug: project.slug })),
      { name: 'privacy' },
    ])
  })

  it('have the public addresses of each language', () => {
    const paths = (locale: Locale) => routes.map((route) => pageUrl(locale, route).slice(site.url.length))
    expect(paths('cs')).toEqual([
      '',
      '/aria',
      '/projekty/elevator-servis',
      '/projekty/esencia-viva',
      '/ochrana-osobnich-udaju',
    ])
    expect(paths('en')).toEqual([
      '/en',
      '/en/aria',
      '/en/projects/elevator-servis',
      '/en/projects/esencia-viva',
      '/en/privacy',
    ])
    expect(paths('de')).toEqual([
      '/de',
      '/de/aria',
      '/de/projekte/elevator-servis',
      '/de/projekte/esencia-viva',
      '/de/datenschutz',
    ])
  })
})

describe('sitemap', () => {
  const entries = sitemap()

  it('lists every page in every language exactly once', () => {
    const urls = entries.map((entry) => entry.url)
    expect(urls).toHaveLength(routes.length * LOCALES.length)
    expect(urls).toHaveLength(15)
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls).toEqual(routes.flatMap((route) => LOCALES.map((locale) => pageUrl(locale, route))))
    expect(urls[0]).toBe(site.url)
  })

  it('gives every entry all its language versions, itself included, and x-default', () => {
    const urls = new Set(entries.map((entry) => entry.url))
    for (const entry of entries) {
      const languages: Record<string, string | undefined> = entry.alternates?.languages ?? {}
      expect(Object.keys(languages)).toEqual(HREFLANGS)
      expect(Object.values(languages)).toContain(entry.url)
      expect(languages['x-default']).toBe(languages.cs)
      // Every alternate is itself an entry of the sitemap.
      for (const url of Object.values(languages)) expect(urls.has(url ?? '')).toBe(true)
    }
  })

  it('weighs the pages sensibly', () => {
    for (const entry of entries) {
      expect(entry.priority).toBeGreaterThan(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
      expect(entry.changeFrequency).toBeDefined()
      expect(entry.lastModified).toBeInstanceOf(Date)
    }
    const priority = (url: string) => entries.find((entry) => entry.url === url)?.priority ?? 0
    expect(priority(site.url)).toBe(1)
    expect(priority(pageUrl('en', { name: 'aria' }))).toBeGreaterThan(priority(pageUrl('en', { name: 'privacy' })))
  })
})

describe('robots', () => {
  it('allows crawling and points to the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${site.url}/sitemap.xml`,
    })
  })
})

describe('hreflang', () => {
  it.each(everyPage)('%s %s names itself as canonical, with a full address', (locale, _name, route) => {
    const canonical = meta(locale, route).alternates?.canonical
    expect(canonical).toBe(pageUrl(locale, route))
    expect(String(canonical).startsWith(`${site.url}`)).toBe(true)
  })

  it.each(everyPage)('%s %s links every language, itself and x-default', (locale, _name, route) => {
    const { canonical, languages } = meta(locale, route).alternates ?? {}
    expect(Object.keys(languages ?? {})).toEqual(HREFLANGS)
    expect(languages?.[locale]).toBe(canonical)
    expect(languages?.['x-default']).toBe(pageUrl('cs', route))
    for (const url of Object.values(languages ?? {})) expect(String(url)).toMatch(/^https?:\/\//)
  })

  it.each(routes.map((route) => [label(route), route] as const))('%s: every language links back', (_name, route) => {
    // Reciprocal: whichever language a crawler starts from, it finds the same set of links,
    // and each language's link is that language's own canonical address.
    const sets = LOCALES.map((locale) => meta(locale, route).alternates?.languages)
    for (const set of sets) expect(set).toEqual(sets[0])
    for (const locale of LOCALES) expect(sets[0]?.[locale]).toBe(meta(locale, route).alternates?.canonical)
    const urls = LOCALES.map((locale) => languageAlternates(route)[locale])
    expect(new Set(urls).size).toBe(LOCALES.length)
  })
})

describe('pageMetadata', () => {
  const shareImage = { url: '/opengraph-image', alt: cs.site.shareImage.alt }

  it('gives a page its canonical address, a large share card and the default share image', () => {
    const data = pageMetadata({ locale: 'cs', title: 'Aria', description: 'Popis', route: { name: 'aria' } })
    expect(data.alternates?.canonical).toBe(`${site.url}/aria`)
    expect(data.openGraph).toMatchObject({
      title: 'Aria',
      description: 'Popis',
      url: `${site.url}/aria`,
      locale: 'cs_CZ',
      images: [shareImage],
    })
    expect(data.twitter).toMatchObject({ card: 'summary_large_image', images: [shareImage] })
  })

  it('uses a page’s own picture when it has one', () => {
    const data = pageMetadata({
      locale: 'cs',
      title: 'P',
      description: 'D',
      route: { name: 'project', slug: 'x' },
      image: '/projects/x.webp',
    })
    expect(data.alternates?.canonical).toBe(`${site.url}/projekty/x`)
    expect(data.openGraph).toMatchObject({ images: ['/projects/x.webp'] })
  })

  it.each([
    ['cs', { name: 'home' }, '', 'cs_CZ'],
    ['en', { name: 'home' }, '/en', 'en_US'],
    ['en', { name: 'privacy' }, '/en/privacy', 'en_US'],
    ['de', { name: 'project', slug: 'x' }, '/de/projekte/x', 'de_DE'],
  ] as const)('gives a %s page its own canonical address and share locale', (locale, route, path, ogLocale) => {
    const data = meta(locale, route)
    expect(data.alternates?.canonical).toBe(`${site.url}${path}`)
    expect(data.openGraph).toMatchObject({ url: `${site.url}${path}`, locale: ogLocale })
    expect(data.openGraph).toMatchObject({ images: [{ url: shareImagePath(locale) }] })
  })

  it.each(LOCALES)('tells share cards about the other two languages of a %s page', (locale) => {
    const others = LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALES[other])
    expect(others).toHaveLength(2)
    expect(meta(locale, { name: 'home' }).openGraph).toMatchObject({ alternateLocale: others })
  })

  it('shares each language’s own picture', () => {
    expect(shareImagePath('cs')).toBe('/opengraph-image')
    expect(shareImagePath('de')).toBe('/de/opengraph-image')
  })

})

/** Every `{ '@id': … }` that only points at another node. */
function references(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(references)
  if (typeof value !== 'object' || value === null) return []
  const entries = Object.entries(value)
  if (entries.length === 1 && entries[0][0] === '@id') return [String(entries[0][1])]
  return entries.filter(([key]) => key !== '@id').flatMap(([, child]) => references(child))
}

const nodeOf = (data: JsonLdGraph, type: string): JsonLdNode => {
  const node = data['@graph'].find((candidate) => candidate['@type'] === type)
  if (!node) throw new Error(`no ${type} node`)
  return node
}

const graphsOf = (locale: Locale): [string, Route, JsonLdGraph][] => {
  const dict = getDictionary(locale)
  return [
    ['home', { name: 'home' }, homeJsonLd(locale, dict)],
    ['aria', { name: 'aria' }, ariaJsonLd(locale, dict)],
    ['privacy', { name: 'privacy' }, privacyJsonLd(locale, getPrivacy(locale))],
    ...localizedProjects(dict).map((project): [string, Route, JsonLdGraph] => [
      `project ${project.slug}`,
      { name: 'project', slug: project.slug },
      projectJsonLd(locale, project),
    ]),
  ]
}
const everyGraph = LOCALES.flatMap((locale) =>
  graphsOf(locale).map(([name, route, data]) => [locale, name, route, data] as const),
)

describe('structured data', () => {
  it('covers every indexable page', () => {
    expect(everyGraph).toHaveLength(routes.length * LOCALES.length)
  })

  it.each(everyGraph)('%s %s is a well-formed schema.org graph', (_locale, _name, _route, data) => {
    expect(data['@context']).toBe('https://schema.org')
    const nodes = data['@graph']
    expect(nodes.length).toBeGreaterThan(0)
    for (const node of nodes) {
      expect(typeof node['@type']).toBe('string')
      expect(String(node['@id'])).toMatch(/^https?:\/\/.+#\w+$/)
    }
    const ids = nodes.map((node) => node['@id'])
    expect(new Set(ids).size).toBe(ids.length)
    // Nothing points at a node the page does not define.
    for (const id of references(nodes)) expect(ids).toContain(id)
    expect(JSON.parse(JSON.stringify(data))).toEqual(data)
  })

  it.each(everyGraph)('%s %s says which page it is and in which language', (locale, _name, route, data) => {
    const page = nodeOf(data, 'WebPage')
    expect(page.url).toBe(pageUrl(locale, route))
    expect(page.inLanguage).toBe(locale)
    expect(page.name).toBeTruthy()
    expect(page.description).toBeTruthy()
    expect(nodeOf(data, 'WebSite')).toMatchObject({ name: site.name, url: site.url, inLanguage: [...LOCALES] })
  })

  it.each(everyGraph)('%s %s claims no ratings, reviews or prices', (_locale, _name, _route, data) => {
    expect(JSON.stringify(data)).not.toMatch(/"(aggregateRating|review|offers|price|priceRange)"/)
  })

  it('describes IndiWeb as a professional service with its founders and services', () => {
    const data = organizationJsonLd('cs', cs)
    expect(data['@type']).toBe('ProfessionalService')
    expect(data).toMatchObject({ name: site.name, url: site.url, email: site.email, description: cs.site.description })
    expect(data.founder.map((person) => person.name)).toEqual(team.map((member) => member.name))
    for (const service of localizedServices(cs)) expect(data.knowsAbout).toContain(service.title)
  })

  it('says IndiWeb works in every language of the site and links its Fab store', () => {
    for (const locale of LOCALES) {
      const data = organizationJsonLd(locale, getDictionary(locale))
      for (const language of LOCALES) expect(data.knowsLanguage).toContain(language)
      expect(data.sameAs).toContain(FAB_STORE_URL)
      expect(data.image).toBe(`${site.url}${shareImagePath(locale)}`)
    }
    // One organization, whichever language describes it.
    expect(organizationJsonLd('en', cs)['@id']).toBe(organizationJsonLd('cs', cs)['@id'])
  })

  it('puts the organization, the site and the page on the home page', () => {
    const types = homeJsonLd('en', getDictionary('en'))['@graph'].map((node) => node['@type'])
    expect(types).toEqual(['ProfessionalService', 'WebSite', 'WebPage'])
  })

  it.each(LOCALES)('describes Aria as a service IndiWeb provides (%s)', (locale) => {
    const dict = getDictionary(locale)
    const data = ariaJsonLd(locale, dict)
    const service = nodeOf(data, 'Service')
    expect(service).toMatchObject({
      name: 'Aria',
      serviceType: dict.aria.page.serviceType,
      description: dict.aria.description,
      url: pageUrl(locale, { name: 'aria' }),
      provider: { '@id': nodeOf(data, 'Organization')['@id'] },
    })
    expect(nodeOf(data, 'WebPage').mainEntity).toEqual({ '@id': service['@id'] })
  })

  it.each(LOCALES.flatMap((locale) => projects.map((project) => [locale, project.slug] as const)))(
    'gives the %s page of %s a breadcrumb from the home page',
    (locale, slug) => {
      const project = localizedProjects(getDictionary(locale)).find((candidate) => candidate.slug === slug)
      if (!project) throw new Error(`no project ${slug}`)
      const data = projectJsonLd(locale, project)
      const breadcrumb = nodeOf(data, 'BreadcrumbList')
      expect(breadcrumb.itemListElement).toEqual([
        { '@type': 'ListItem', position: 1, name: site.name, item: pageUrl(locale, { name: 'home' }) },
        { '@type': 'ListItem', position: 2, name: project.title, item: pageUrl(locale, { name: 'project', slug }) },
      ])
      expect(nodeOf(data, 'WebPage').breadcrumb).toEqual({ '@id': breadcrumb['@id'] })
      expect(nodeOf(data, 'CreativeWork')).toMatchObject({ name: project.title, url: project.liveUrl })
    },
  )
})

// What search results show before they cut the text off.
const TITLE_LIMIT = 60
const DESCRIPTION_LIMIT = 160

describe('search snippets', () => {
  it.each(LOCALES)('the %s site title fits a search result', (locale) => {
    expect(getDictionary(locale).site.title.length).toBeLessThanOrEqual(TITLE_LIMIT)
  })

  it.each(LOCALES)('every %s description fits a search result', (locale) => {
    const dict = getDictionary(locale)
    const descriptions: Record<string, string> = {
      home: dict.site.description,
      aria: dict.aria.page.metaDescription,
      privacy: getPrivacy(locale).metaDescription,
      ...Object.fromEntries(localizedProjects(dict).map((project) => [`project ${project.slug}`, project.summary])),
    }
    const tooLong = Object.entries(descriptions)
      .filter(([, text]) => text.length > DESCRIPTION_LIMIT)
      .map(([page, text]) => `${page}: ${text.length}`)
    expect(tooLong).toEqual([])
    for (const text of Object.values(descriptions)) expect(text.trim()).not.toBe('')
  })
})

describe('redirects', () => {
  it('sends aria.indiweb.cz, whatever the path, to Aria’s page', async () => {
    const rules = (await nextConfig.redirects?.()) ?? []
    expect(rules).toContainEqual({
      source: '/:path*',
      has: [{ type: 'host', value: 'aria.indiweb.cz' }],
      destination: 'https://www.indiweb.cz/aria',
      permanent: true,
    })
  })
})
