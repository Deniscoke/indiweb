import type { Dictionary } from './locales/cs'
import type { FabListing, FabListingData } from './types'

const listing = (id: string) => `https://www.fab.com/listings/${id}`

/** Our store on Fab, Epic Games' marketplace for Unreal Engine. */
export const FAB_STORE_URL = 'https://www.fab.com/sellers/IndiWeb'

/** Every listing in the store; the featured ones get a card, in this order. */
const LISTINGS = [
  { slug: 'combat-vfx', title: 'Stylized Combat VFX Pack', url: listing('9e3f7d95-3f94-4323-af1f-0a078554646a'), featured: true },
  { slug: 'arena-match', title: 'Arena Match Framework', url: listing('2c25303a-fd68-4daf-bc0c-400d2f704af5'), featured: true },
  { slug: 'voxel-spell-fx', title: 'Voxel Spell FX', url: listing('5e4e97f7-82a1-41ac-904a-4f10553c8629'), featured: true },
  { slug: 'gravity-lift', title: 'Gravity Lift', url: listing('99600618-eef9-4df2-81a9-8d70cd8f0bab'), featured: true },
  { slug: 'lumenroute-scifi', title: 'LumenRoute — Sci-Fi Wayfinding Kit', url: listing('6d4252ef-4cb1-4d9d-b787-e7640c738617'), featured: true },
  { slug: 'multiplayer-objectives', title: 'Multiplayer Objectives Kit', url: listing('32d39fb0-fb28-437f-9517-43f8128775e6'), featured: true },
  { slug: 'swap-destruction', title: 'Swap Destruction Kit', url: listing('2327b379-5218-44fa-abca-02a0350f36a7'), featured: true },
  { slug: 'fp-parkour', title: 'FP Parkour & Procedural Hands', url: listing('c2a1f600-3bad-474a-b687-64fe7193fb5a'), featured: true },
  { slug: 'combat-feedback', title: 'Combat Feedback Toolkit', url: listing('8ad158cc-b8a5-4b35-9c71-9333451122c4') },
  { slug: 'lumenroute-floor', title: 'LumenRoute: Floor Navigation & Landing Markings', url: listing('b4de6acd-9c0d-4fc1-84ce-8101b291d095') },
  { slug: 'lumenroute-cargo', title: 'LumenRoute: Cargo & Hazard Decal Pack', url: listing('47f7f3d4-cbc9-49fe-82d4-72f22dc751d9') },
  { slug: 'options-rebinding', title: 'Options & Rebinding Kit', url: listing('0ad9c053-33ae-4920-8740-0390d77b1a5d') },
  { slug: 'pixel-grid', title: 'Pixel Grid: Exact Pixel Look', url: listing('52d5d7d8-8179-4e31-b857-6b8d1ede421b') },
  { slug: 'cook-path-guard', title: 'Cook Path Guard', url: listing('cfc7c55d-18c1-4b25-9bfa-28aa8d1175f8') },
  { slug: 'bench-walk', title: 'Bench Walk', url: listing('b6bb6eaf-ddd0-42c5-8af7-e8515577f4a2') },
] as const satisfies readonly FabListingData[]

export type FabSlug = (typeof LISTINGS)[number]['slug']

// Typed by slug, so every dictionary must say what each listing is.
export const fabListings: readonly (FabListingData & { slug: FabSlug })[] = LISTINGS

/** The listings with what each one is, said in one language. */
export function localizedFabListings(dict: Dictionary): FabListing[] {
  return fabListings.map((listing) => ({ ...listing, kind: dict.fab.kinds[listing.slug] }))
}

export const FAB_IMAGE_SIZE = { width: 960, height: 540 }

export const fabImage = (slug: string) => `/fab/${slug}.webp`
