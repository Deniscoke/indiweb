import type { MetadataRoute } from 'next'
import { LOCALES, type Route } from '@/lib/i18n'
import { indexableRoutes, languageAlternates, pageUrl } from '@/lib/seo'

type Entry = MetadataRoute.Sitemap[number]

/** How much a kind of page matters and how often it changes; the same in every language. */
const WEIGHT: Record<Route['name'], Pick<Entry, 'changeFrequency' | 'priority'>> = {
  home: { changeFrequency: 'monthly', priority: 1 },
  aria: { changeFrequency: 'monthly', priority: 0.8 },
  project: { changeFrequency: 'yearly', priority: 0.6 },
  privacy: { changeFrequency: 'yearly', priority: 0.2 },
}

/** Every page in every language, each naming all its language versions (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return indexableRoutes().flatMap((route) =>
    LOCALES.map((locale) => ({
      url: pageUrl(locale, route),
      lastModified,
      ...WEIGHT[route.name],
      alternates: { languages: languageAlternates(route) },
    })),
  )
}
