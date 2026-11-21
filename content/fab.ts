import type { FabListing } from './types'

const listing = (id: string) => `https://www.fab.com/listings/${id}`

/** Our store on Fab, Epic Games' marketplace for Unreal Engine. */
export const fabStore = {
  eyebrow: 'IndiWeb Store na Fabu',
  title: 'Stavíme i pro hry. Naše assety běží v Unreal Enginu.',
  lead: 'Na Fabu, obchodě Epic Games, prodáváme vlastní pluginy, efekty a prostředí pro Unreal Engine 5. Vývojáři si je stáhnou a mají je ve hře během pár minut.',
  url: 'https://www.fab.com/sellers/IndiWeb',
  facts: ['Unreal Engine 5', 'C++ i Blueprint', 'Multiplayer'],
}

/** Every listing in the store; the featured ones get a card, in this order. */
export const fabListings: FabListing[] = [
  { slug: 'combat-vfx', title: 'Stylized Combat VFX Pack', url: listing('9e3f7d95-3f94-4323-af1f-0a078554646a'), kind: 'VFX · Niagara', featured: true },
  { slug: 'arena-match', title: 'Arena Match Framework', url: listing('2c25303a-fd68-4daf-bc0c-400d2f704af5'), kind: 'Plugin · Multiplayer', featured: true },
  { slug: 'voxel-spell-fx', title: 'Voxel Spell FX', url: listing('5e4e97f7-82a1-41ac-904a-4f10553c8629'), kind: 'Plugin · Kouzla', featured: true },
  { slug: 'gravity-lift', title: 'Gravity Lift', url: listing('99600618-eef9-4df2-81a9-8d70cd8f0bab'), kind: 'Plugin · Gameplay', featured: true },
  { slug: 'lumenroute-scifi', title: 'LumenRoute — Sci-Fi Wayfinding Kit', url: listing('6d4252ef-4cb1-4d9d-b787-e7640c738617'), kind: 'Prostředí · Sci-fi', featured: true },
  { slug: 'multiplayer-objectives', title: 'Multiplayer Objectives Kit', url: listing('32d39fb0-fb28-437f-9517-43f8128775e6'), kind: 'Plugin · Multiplayer', featured: true },
  { slug: 'swap-destruction', title: 'Swap Destruction Kit', url: listing('2327b379-5218-44fa-abca-02a0350f36a7'), kind: 'Plugin · Fyzika', featured: true },
  { slug: 'fp-parkour', title: 'FP Parkour & Procedural Hands', url: listing('c2a1f600-3bad-474a-b687-64fe7193fb5a'), kind: 'Plugin · Pohyb', featured: true },
  { slug: 'combat-feedback', title: 'Combat Feedback Toolkit', url: listing('8ad158cc-b8a5-4b35-9c71-9333451122c4'), kind: 'UI kit' },
  { slug: 'lumenroute-floor', title: 'LumenRoute: Floor Navigation & Landing Markings', url: listing('b4de6acd-9c0d-4fc1-84ce-8101b291d095'), kind: 'Materiály' },
  { slug: 'lumenroute-cargo', title: 'LumenRoute: Cargo & Hazard Decal Pack', url: listing('47f7f3d4-cbc9-49fe-82d4-72f22dc751d9'), kind: 'Materiály' },
  { slug: 'options-rebinding', title: 'Options & Rebinding Kit', url: listing('0ad9c053-33ae-4920-8740-0390d77b1a5d'), kind: 'Plugin · UI' },
  { slug: 'pixel-grid', title: 'Pixel Grid: Exact Pixel Look', url: listing('52d5d7d8-8179-4e31-b857-6b8d1ede421b'), kind: 'Nástroj · Editor' },
  { slug: 'cook-path-guard', title: 'Cook Path Guard', url: listing('cfc7c55d-18c1-4b25-9bfa-28aa8d1175f8'), kind: 'Nástroj · Editor' },
  { slug: 'bench-walk', title: 'Bench Walk', url: listing('b6bb6eaf-ddd0-42c5-8af7-e8515577f4a2'), kind: 'Nástroj · Výkon' },
]

export const FAB_IMAGE_SIZE = { width: 960, height: 540 }

export const fabImage = (slug: string) => `/fab/${slug}.webp`

/** "15 produktů", "3 produkty", "1 produkt". */
export function productCount(count: number): string {
  if (count === 1) return '1 produkt'
  if (count >= 2 && count <= 4) return `${count} produkty`
  return `${count} produktů`
}
