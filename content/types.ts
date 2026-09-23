export const SERVICE_IDS = ['web', '3d', 'ai', 'konzultace'] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

export type Service = {
  id: ServiceId
  title: string
  summary: string
  points: string[]
  featured?: boolean
}

export type Market = 'SK' | 'CZ'

export type Project = {
  slug: string
  title: string
  client: string
  market: Market
  tags: string[]
  summary: string
  description: string
  highlights: string[]
  liveUrl: string
  image: string
}

export type TeamMember = {
  slug: string
  name: string
  role: string
  bio: string
  website?: string
  photo?: string
}

export type Step = { title: string; text: string }

export type Product = {
  name: string
  headline: string
  tagline: string
  description: string
  url: string
  capabilities: string[]
  audience: string[]
  rollout: Step[]
}

export type NavItem = { href: string; label: string }

export type Media = { src: string; width: number; height: number; alt: string }
