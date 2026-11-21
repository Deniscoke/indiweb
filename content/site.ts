import type { Media } from './types'

/** The site's public address. indiweb.cz redirects here, so canonical URLs must use www. */
export const PRODUCTION_URL = 'https://www.indiweb.cz'

/** The address the site builds its absolute links from: production, a preview, or local. */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL
  if (env.VERCEL_ENV === 'production') return PRODUCTION_URL
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export const site = {
  name: 'IndiWeb',
  email: 'info.indiweb@gmail.com',
  url: resolveSiteUrl(),
}

/** Home page sections in the menu, by their id. Ids stay Czech in every language. */
export const NAV_SECTIONS = ['sluzby', 'splaty', 'aria', 'projekty', 'fab', 'o-nas', 'kontakt'] as const
export type NavSection = (typeof NAV_SECTIONS)[number]

export const CONTACT_ID = 'kontakt'
export const PROJECTS_ID = 'projekty'

export const media = {
  laptop: { src: '/media/macbook.webp', width: 1376, height: 768 },
  phone: { src: '/media/phone.webp', width: 896, height: 1200 },
} satisfies Record<string, Media>
