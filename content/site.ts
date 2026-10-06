import type { Media, NavItem } from './types'

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
  title: 'IndiWeb — weby na míru, 3D a AI agenti',
  description:
    'Denis, Adam a Ondra. Navrhujeme weby, 3D vizualizace a AI agenty, kteří za vás zvednou telefon.',
  email: 'info.indiweb@gmail.com',
  url: resolveSiteUrl(),
  locale: 'cs_CZ',
}

export const navigation: NavItem[] = [
  { href: '/#sluzby', label: 'Služby' },
  { href: '/#splaty', label: '3D' },
  { href: '/#aria', label: 'Aria' },
  { href: '/#projekty', label: 'Projekty' },
  { href: '/#o-nas', label: 'O nás' },
  { href: '/#kontakt', label: 'Kontakt' },
]

export const contactHref = '/#kontakt'
export const PRIVACY_HREF = '/ochrana-osobnich-udaju'

export const hero = {
  /** Three lines spread across the hero, lit by the pointer. */
  lines: ['Navrhneme.', 'Postavíme.', 'Rozsvítíme.'],
  subtitle:
    'Weby, 3D vizualizace a AI agenti od Denise, Adama a Ondry. Na míru, rychle a s AI v každém kroku.',
  hint: 'Odpovídáme do 24 hodin, nezávazně.',
}

export const media = {
  laptop: {
    src: '/media/macbook.webp',
    width: 1376,
    height: 768,
    alt: 'Pootevřený MacBook ve tmě',
  },
  phone: {
    src: '/media/phone.webp',
    width: 896,
    height: 1200,
    alt: 'Chytrý telefon ve tmě',
  },
} satisfies Record<string, Media>
