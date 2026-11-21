// Shapes of the site's content. Language-neutral data lives in content/*.ts,
// every text in content/locales; the types below are the two joined together.

export const SERVICE_IDS = ['web', '3d', 'ai', 'konzultace'] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

export type ServiceText = { title: string; summary: string; points: string[] }
export type Service = ServiceText & { id: ServiceId; featured?: boolean }

export type Market = 'SK' | 'CZ'

export type ProjectData = { slug: string; title: string; market: Market; liveUrl: string; image: string }
export type ProjectText = {
  client: string
  tags: string[]
  summary: string
  description: string
  highlights: string[]
}
export type Project = ProjectData & ProjectText

export type TeamMemberData = { slug: string; name: string; website?: string; photo?: string }
export type TeamMemberText = { role: string; bio: string }
export type TeamMember = TeamMemberData & TeamMemberText

export type Step = { title: string; text: string }

export type Media = { src: string; width: number; height: number }

export type FabListingData = {
  slug: string
  /** The product's name on Fab: the same in every language. */
  title: string
  url: string
  /** Shown as a card with its preview at /fab/<slug>.webp. */
  featured?: boolean
}
/** `kind`: what it is, in a few words, shown on the card. */
export type FabListing = FabListingData & { kind: string }
