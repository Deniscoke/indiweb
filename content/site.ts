import type { Media, NavItem } from './types'

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const site = {
  name: 'IndiWeb',
  title: 'IndiWeb — Weby a digitální zážitky',
  description:
    'Denis, Adam a Ondra. Navrhujeme weby, 3D vizualizace a AI agenty, kteří za vás zvednou telefon.',
  email: 'info.indiweb@gmail.com',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (productionHost ? `https://${productionHost}` : 'http://localhost:3000'),
  locale: 'cs_CZ',
}

export const navigation: NavItem[] = [
  { href: '/#sluzby', label: 'Služby' },
  { href: '/#aria', label: 'Aria' },
  { href: '/#projekty', label: 'Projekty' },
  { href: '/#o-nas', label: 'O nás' },
  { href: '/#kontakt', label: 'Kontakt' },
]

export const contactHref = '/#kontakt'

export const hero = {
  eyebrow: 'Přijímáme nové projekty',
  titleLead: 'Weby a digitální zážitky,',
  titleRotatingPrefix: 'které',
  rotatingWords: ['prodávají', 'zaujmou', 'pracují za vás'],
  subtitle:
    'Jsme Denis, Adam a Ondra. Navrhujeme weby, 3D vizualizace a AI agenty, kteří za vás zvednou telefon. Na míru, rychle a s AI v každém kroku.',
  hint: 'Nezávazně · Odpovídáme do 24 hodin',
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
