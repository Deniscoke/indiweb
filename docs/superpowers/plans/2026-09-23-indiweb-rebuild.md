# IndiWeb rebuild — implementačný plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nahradiť statickú jednostránku IndiWebu webom v Next.js 16: úvod so službami, produktom Aria, portfóliom, tímom a funkčným formulárom (Resend → `info.indiweb@gmail.com`), plus podstránky `/aria` a `/projekty/[slug]`.

**Architecture:** Next.js App Router, všetky stránky statické; jediná dynamická časť je Server Action formulára. Obsah (služby, projekty, tím, Aria) žije v typovaných súboroch `content/*.ts`, komponenty ho len zobrazujú. Formulár odosiela cez `onSubmit` + `startTransition`, takže React pri chybe nevymaže vyplnené polia.

**Tech Stack:** Next.js 16.3.6, React 19.2.8, TypeScript 5, Tailwind CSS 4 (CSS-first), Zod 4.6, Resend 6.28, Vitest 5 + Testing Library + jsdom 29, sharp, playwright-core (screenshoty cez lokálny Edge).

**Spec:** `docs/superpowers/specs/2026-09-23-indiweb-rebuild-design.md`

## Global Constraints

- Shell je **Git Bash na Windows 11**; Node **24.13.1**, npm 11. Všetky príkazy sa spúšťajú z koreňa repa `C:/Users/Admin/Desktop/INDIWEBB`.
- Práca prebieha na vetve **`feat/rebuild`**. **Nič sa nepushuje** až do Task 14, a aj tam len po výslovnom súhlase používateľa.
- Verzie (overené 2026-09-23, nemeniť bez dôvodu): `next@16.3.6`, `react`/`react-dom` `19.2.8` (tak, ako ich nainštaluje create-next-app), `typescript@^5` (**nie** 7 — typescript-eslint ho nepodporuje), `eslint@^9` (**nie** 10 — ERESOLVE), `@types/node@^24` (s `^20` sa Vitest 5 nenainštaluje), `vitest@^5.0.1`, `vite@^8.3.0`, `@vitejs/plugin-react@^6.1.1`, `jsdom@^29.1.1` (**nie** 30 — vyžaduje Node ≥ 24.15), `@testing-library/react@^16.3.3`, `@testing-library/dom@^10.4.2`, `zod@^4.6.5`, `resend@^6.28.1`, `sharp@^0.35.4`, `playwright-core@^1.63.0`.
- Jazyk webu je **čeština**, `<html lang="cs">`. Všetky texty v UI sú česky so správnou diakritikou.
- E-mail na príjem dopytov: **`info.indiweb@gmail.com`** (jediné miesto: `content/site.ts`).
- Farby a písma iba cez tokeny v `app/globals.css` (`bg-bg`, `text-fg`, `text-fg-dim`, `text-fg-faint`, `text-accent`, `bg-accent`, `border-line`, `border-line-strong`, `bg-surface`, `font-display`). V custom CSS nepoužívať `var(--color-…)` — Tailwind emituje len použité premenné; farby v custom CSS písať priamo.
- Tailwind v4: žiadny `tailwind.config.js`; `bg-opacity-*` neexistuje (používať `bg-black/50`); `outline-none` → `outline-hidden`; `border` vždy s farbou; gradient = `bg-linear-to-*`.
- `next/image`: prop `priority` je v Next 16 zastaraný → pre obrázky nad okrajom obrazovky `loading="eager" fetchPriority="high"`. Obrázky so `src` stringom vždy s `width`/`height` alebo `fill`.
- Lint (`eslint-plugin-react-hooks` v Next 16) hlási chybu pri `setState` priamo v tele `useEffect`. Hodnoty z prehliadača (media query) čítať cez `useSyncExternalStore`; `setState` iba v callbackoch (listener, interval, observer).
- Súbor s `'use server'` smie exportovať **iba async funkcie** (typy sú OK). Pomocné funkcie patria do `lib/`.
- Vitest 5: `vi.mock`/`vi.hoisted` iba na najvyššej úrovni súboru; mock triedy cez `class`/`function`, nie arrow; `clearMocks` je predvolene zapnuté; `expect(...).resolves` vždy `await`. Testy komponentov majú na prvom riadku `// @vitest-environment jsdom`.
- Commity: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`), správa končí riadkom `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Commitovať vždy len konkrétne súbory danej úlohy.

## Mapa súborov

```
app/
  layout.tsx                  root layout: fonty, metadáta, Header, Footer, dekorácie
  globals.css                 Tailwind + dizajnové tokeny + reveal/ambient štýly
  page.tsx                    úvodná stránka (skladá sekcie)
  not-found.tsx               404
  aria/page.tsx               /aria
  projekty/[slug]/page.tsx    case study (statické, dynamicParams = false)
  sitemap.ts, robots.ts, opengraph-image.tsx
  actions/send-inquiry.ts     Server Action formulára ('use server')
components/
  ui/container.tsx, ui/button-link.tsx, ui/section-heading.tsx, ui/reveal.tsx, ui/browser-frame.tsx
  layout/header.tsx, layout/footer.tsx
  home/hero.tsx, home/rotating-word.tsx, home/services.tsx, home/aria-teaser.tsx,
  home/projects.tsx, home/project-card.tsx, home/process.tsx, home/team.tsx, home/team-card.tsx
  contact/contact-section.tsx, contact/inquiry-form.tsx
  aria/aria-page.tsx
  project/project-detail.tsx
content/
  types.ts, site.ts, services.ts, projects.ts, team.ts, aria.ts, process.ts
lib/
  cn.ts, projects.ts, use-reduced-motion.ts,
  inquiry-options.ts (bez zod — importuje ho aj klient), inquiry-schema.ts (zod), inquiry-email.ts
scripts/
  optimize-images.mjs, capture-screenshots.mjs
assets-src/                   zdrojové PNG fotky (macbook, phone)
public/media/*.webp, public/projects/*.webp
vitest.config.mts, vitest.setup.ts, vercel.json, .env.example
```

Testy ležia vedľa testovaného súboru ako `*.test.ts(x)`.

---

### Task 1: Next.js kostra namiesto statickej stránky

**Files:**
- Delete: `index.html`, `images/tablet.png`
- Move: `images/macbook.png` → `assets-src/macbook.png`, `images/phone.png` → `assets-src/phone.png`
- Create (scaffold): `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/favicon.ico`, `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `README.md`
- Create: `vercel.json`

**Interfaces:**
- Produces: funkčný `npm run build` a `npm run lint`; skripty `test` a `test:watch` v `package.json`; alias `@/*` → koreň repa.

- [ ] **Step 1: Vytvor vetvu a uprac starý web**

```bash
git switch -c feat/rebuild
git rm -q index.html images/tablet.png
mkdir -p assets-src
git mv images/macbook.png assets-src/macbook.png
git mv images/phone.png assets-src/phone.png
rmdir images 2>/dev/null || true
git status --short
```

Expected: `D index.html`, `D images/tablet.png`, `R images/macbook.png -> assets-src/macbook.png`, `R images/phone.png -> assets-src/phone.png`.

- [ ] **Step 2: Vygeneruj Next.js do podpriečinka a presuň ho do koreňa**

create-next-app odmieta neprázdny priečinok a meno `INDIWEBB` (veľké písmená), preto sa generuje do `indiweb-app` a potom presúva vrátane dotfiles.

```bash
npx --yes create-next-app@16.3.6 indiweb-app --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --no-react-compiler --disable-git --skip-install
cp -a indiweb-app/. .
rm -rf indiweb-app
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
ls -A
```

Expected: v koreni sú `app/`, `public/`, `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `README.md` + pôvodné `.git/`, `docs/`, `assets-src/`.

- [ ] **Step 3: Nastav package.json a nainštaluj závislosti**

```bash
npm pkg set name=indiweb
npm pkg set "scripts.test=vitest run" "scripts.test:watch=vitest"
npm install
npm install -D @types/node@^24
```

Expected: inštalácia bez `ERESOLVE`. (`npm warn install-scripts` o `unrs-resolver` je v poriadku.)

- [ ] **Step 4: Povoľ commit `.env.example` a pridaj `vercel.json`**

Vygenerovaný `.gitignore` ignoruje všetky `.env*`. Na koniec súboru pridaj výnimku:

```bash
printf '\n# example env file is safe to commit\n!.env.example\n' >> .gitignore
```

Vytvor `vercel.json` (prepíše framework preset projektu na Verceli, ktorý je teraz „Other"):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

- [ ] **Step 5: Nahraď ukážkovú stránku dočasným obsahom**

`app/page.tsx` (ukážka odkazuje na zmazané SVG; plná stránka príde v Task 8):

```tsx
export default function HomePage() {
  return <h1>IndiWeb</h1>
}
```

- [ ] **Step 6: Over build a lint**

```bash
npm run build
npm run lint
```

Expected: build skončí `✓ Compiled successfully` a vypíše route `/`; lint bez chýb.

- [ ] **Step 7: Commit**

Zmazanie `index.html`/`images/tablet.png` a presun fotiek sú už v indexe zo Step 1 (tie cesty sa do `git add` nepíšu — neexistujú a git by skončil `fatal: pathspec`). `public/` je teraz prázdny, preto tiež nie je v zozname.

```bash
git add .gitignore AGENTS.md CLAUDE.md README.md app eslint.config.mjs next.config.ts package.json package-lock.json postcss.config.mjs tsconfig.json vercel.json
git status --short
git commit -F - <<'MSG'
chore: scaffold Next.js 16 app in place of the static page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 2: Vitest a obsahový model

**Files:**
- Create: `vitest.config.mts`, `vitest.setup.ts`
- Create: `content/types.ts`, `content/site.ts`, `content/services.ts`, `content/projects.ts`, `content/team.ts`, `content/aria.ts`, `content/process.ts`
- Create: `lib/projects.ts`
- Test: `content/content.test.ts`, `lib/projects.test.ts`

**Interfaces:**
- Produces:
  - `content/types.ts`: `SERVICE_IDS`, `ServiceId`, `Service`, `Market`, `Project`, `TeamMember`, `Step`, `Product`, `NavItem`, `Media`
  - `content/site.ts`: `site` (`name`, `title`, `description`, `email`, `url`, `locale`), `navigation: NavItem[]`, `contactHref`, `hero`, `media` (`laptop`, `phone`)
  - `content/services.ts`: `services: Service[]`
  - `content/projects.ts`: `projects: Project[]`, `PROJECT_IMAGE_SIZE`
  - `content/team.ts`: `team: TeamMember[]`
  - `content/aria.ts`: `aria: Product`
  - `content/process.ts`: `processSteps: Step[]`
  - `lib/projects.ts`: `getProject(slug: string): Project | undefined`, `getNextProject(slug: string): Project | undefined`, `MARKET_LABELS: Record<Market, string>`

- [ ] **Step 1: Nainštaluj testovacie nástroje**

```bash
npm install -D vitest@^5.0.1 vite@^8.3.0 @vitejs/plugin-react@^6.1.1 jsdom@^29.1.1 @testing-library/react@^16.3.3 @testing-library/dom@^10.4.2
```

Expected: bez `ERESOLVE`.

- [ ] **Step 2: Konfigurácia Vitestu**

`vitest.config.mts` (alias `@/` rieši vstavané `resolve.tsconfigPaths` vo Vite 8 — overené, plugin `vite-tsconfig-paths` netreba):

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**'],
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
```

`vitest.setup.ts` (Testing Library bez `globals: true` nečistí DOM sama):

```ts
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 3: Napíš padajúce testy obsahu**

`content/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { aria } from '@/content/aria'
import { processSteps } from '@/content/process'
import { projects } from '@/content/projects'
import { services } from '@/content/services'
import { hero, navigation, site } from '@/content/site'
import { team } from '@/content/team'
import { SERVICE_IDS } from '@/content/types'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const isHttps = (url: string) => new URL(url).protocol === 'https:'

describe('site', () => {
  it('uses the IndiWeb inbox', () => {
    expect(site.email).toBe('info.indiweb@gmail.com')
  })

  it('points every navigation item to a home page section', () => {
    for (const item of navigation) expect(item.href).toMatch(/^\/#[a-z-]+$/)
  })

  it('rotates at least two hero words', () => {
    expect(hero.rotatingWords.length).toBeGreaterThanOrEqual(2)
  })
})

describe('services', () => {
  it('covers every service id exactly once', () => {
    expect(services.map((s) => s.id).sort()).toEqual([...SERVICE_IDS].sort())
  })

  it('features exactly one service, the web', () => {
    expect(services.filter((s) => s.featured).map((s) => s.id)).toEqual(['web'])
  })

  it('gives every service at least two points', () => {
    for (const s of services) expect(s.points.length).toBeGreaterThanOrEqual(2)
  })
})

describe('projects', () => {
  it('has unique url-safe slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(SLUG)
  })

  it('links to live https sites', () => {
    for (const p of projects) expect(isHttps(p.liveUrl)).toBe(true)
  })

  it('stores each screenshot as /projects/<slug>.webp', () => {
    for (const p of projects) expect(p.image).toBe(`/projects/${p.slug}.webp`)
  })

  it('keeps card summaries at most 140 characters', () => {
    for (const p of projects) expect(p.summary.length).toBeLessThanOrEqual(140)
  })

  it('lists tags and highlights', () => {
    for (const p of projects) {
      expect(p.tags.length).toBeGreaterThan(0)
      expect(p.highlights.length).toBeGreaterThan(0)
    }
  })
})

describe('team', () => {
  it('introduces Denis, Adam and Ondra in this order', () => {
    expect(team.map((m) => m.slug)).toEqual(['denis', 'adam', 'ondra'])
  })

  it('links Denis to his personal site', () => {
    expect(team.find((m) => m.slug === 'denis')?.website).toBe('https://mojweb2.vercel.app')
  })

  it('uses https for every personal website', () => {
    for (const m of team) if (m.website) expect(isHttps(m.website)).toBe(true)
  })
})

describe('aria', () => {
  it('points to an https url', () => {
    expect(isHttps(aria.url)).toBe(true)
  })

  it('describes capabilities, audience and a four-step rollout', () => {
    expect(aria.capabilities.length).toBeGreaterThanOrEqual(3)
    expect(aria.audience.length).toBeGreaterThanOrEqual(3)
    expect(aria.rollout).toHaveLength(4)
  })
})

describe('process', () => {
  it('has four steps', () => {
    expect(processSteps).toHaveLength(4)
  })
})
```

`lib/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/content/projects'
import { getNextProject, getProject, MARKET_LABELS } from '@/lib/projects'

describe('getProject', () => {
  it('finds a project by slug', () => {
    expect(getProject('elevator-servis')?.title).toBe('Elevátor Servis')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProject('neexistuje')).toBeUndefined()
  })
})

describe('getNextProject', () => {
  it('returns the following project', () => {
    expect(getNextProject(projects[0].slug)).toBe(projects[1])
  })

  it('wraps around to the first project', () => {
    expect(getNextProject(projects[projects.length - 1].slug)).toBe(projects[0])
  })

  it('returns undefined for an unknown slug', () => {
    expect(getNextProject('neexistuje')).toBeUndefined()
  })
})

describe('MARKET_LABELS', () => {
  it('names both markets in Czech', () => {
    expect(MARKET_LABELS).toEqual({ SK: 'Slovensko', CZ: 'Česko' })
  })
})
```

- [ ] **Step 4: Spusti testy a over, že padajú**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/content/aria"` (moduly ešte neexistujú).

- [ ] **Step 5: Typy**

`content/types.ts`:

```ts
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
```

- [ ] **Step 6: Obsah webu**

`content/site.ts` (`url`: explicitná `NEXT_PUBLIC_SITE_URL`, inak produkčná doména z Vercelu, lokálne localhost):

```ts
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
```

`content/services.ts`:

```ts
import type { Service } from './types'

export const services: Service[] = [
  {
    id: 'web',
    featured: true,
    title: 'Weby na míru',
    summary:
      'Rychlé a přehledné weby, které návštěvníkům řeknou to podstatné a dovedou je k poptávce.',
    points: [
      'Návrh i vývoj na míru, žádné šablony',
      'Rezervace, e-shop, více jazyků',
      'SEO a rychlé načítání v základu',
      'Úpravy a péče i po spuštění',
    ],
  },
  {
    id: '3d',
    title: '3D a Gaussian splaty',
    summary:
      'Interaktivní 3D prostředí a fotorealistické splaty prostor, kterými se dá projít přímo v prohlížeči.',
    points: ['Virtuální prohlídky prostor', '3D vizualizace produktů', 'Interaktivní scény na web'],
  },
  {
    id: 'ai',
    title: 'AI agenti a integrace',
    summary:
      'Hlasoví a chatovací agenti, kteří odpovídají vašim zákazníkům, a AI napojená na vaše procesy.',
    points: [
      'Hlasový agent na telefon',
      'Chatboti na web',
      'Automatizace a napojení na vaše systémy',
    ],
  },
  {
    id: 'konzultace',
    title: 'Konzultace',
    summary:
      'Pomůžeme vám rozhodnout, co dává smysl — web, AI, nebo obojí — a co si klidně ušetříte.',
    points: [
      'Audit současného webu',
      'Návrh digitálního řešení',
      'Kde vám AI reálně ušetří čas',
    ],
  },
]
```

`content/projects.ts` (fakty prevzaté z oboch živých webov; texty skontroluje tím):

```ts
import type { Project } from './types'

/** Every screenshot is a 1440×900 viewport capture (see scripts/capture-screenshots.mjs). */
export const PROJECT_IMAGE_SIZE = { width: 1440, height: 900 } as const

export const projects: Project[] = [
  {
    slug: 'elevator-servis',
    title: 'Elevátor Servis',
    client: 'Servis výtahů · Banská Bystrica',
    market: 'SK',
    tags: ['Web', 'B2B', 'Služby'],
    summary:
      'Web pro servisní firmu, který mluví jazykem správců domů a vede je k nezávazné poptávce.',
    description:
      'Elevátor Servis se stará o více než 300 výtahů v Banské Bystrici a okolí. Web má správcům domů, firmám a institucím rychle ukázat, s čím jim firma pomůže, a důvěryhodně je dovést k poptávce. Stojí na konkrétních situacích, se kterými lidé volají — od opakovaných poruch až po uvíznutí ve výtahu.',
    highlights: [
      'Texty postavené na problémech zákazníků',
      'Samostatná stránka pro každou službu',
      'Viditelná nonstop havarijní linka',
      'Srozumitelný postup převzetí výtahu do servisu',
    ],
    liveUrl: 'https://elevatorservis.sk',
    image: '/projects/elevator-servis.webp',
  },
  {
    slug: 'esencia-viva',
    title: 'Esencia Viva',
    client: 'Masáže a aromaterapie',
    market: 'CZ',
    tags: ['Web', 'Rezervace', 'E-shop'],
    summary:
      'Jemný, atmosférický web, na kterém si klienti rezervují sezení i koupí produkty.',
    description:
      'Esencia Viva nabízí masáže, aromaterapii a práci s bylinkami. Web měl přenést klid, který klienti zažijí na sezení, a zároveň zvládnout praktické věci: rezervace, prodej produktů a věrnostní program. Výsledkem je vzdušný design s atmosférickým úvodem a kompletním právním zázemím pro e-shop.',
    highlights: [
      'Atmosférický úvod a klidný vizuální jazyk',
      'Rezervace prvního sezení',
      'E-shop s produkty a věrnostním programem',
      'Obchodní podmínky, ochrana údajů a cookies',
    ],
    liveUrl: 'https://esenciaviva.cz',
    image: '/projects/esencia-viva.webp',
  },
]
```

`content/team.ts`:

```ts
import type { TeamMember } from './types'

// TODO: doplnit — role a bio si každý člen týmu upraví sám.
export const team: TeamMember[] = [
  {
    slug: 'denis',
    name: 'Denis Mitrović',
    role: 'Spoluzakladatel',
    bio: 'Stojí za weby a digitálními zážitky IndiWebu.',
    website: 'https://mojweb2.vercel.app',
  },
  {
    slug: 'adam',
    name: 'Adam',
    role: 'Spoluzakladatel',
    bio: 'Provází projekty od prvního nápadu až po spuštění.',
  },
  {
    slug: 'ondra',
    name: 'Ondra',
    role: 'Spoluzakladatel',
    bio: 'Provází projekty od prvního nápadu až po spuštění.',
  },
]
```

`content/aria.ts` (URL sa po presune na `aria.indiweb.cz` mení iba tu):

```ts
import type { Product } from './types'

export const aria: Product = {
  name: 'Aria',
  headline: 'Aria — náš AI hlasový agent',
  tagline: 'AI hlasový agent, který vezme každý telefon.',
  description:
    'Aria za vás 24 hodin denně zvedá telefony — odpovídá na dotazy, přijímá rezervace a zapisuje vzkazy. Vy se věnujete zákazníkům na místě a žádný hovor nepropadne.',
  url: 'https://aria-eta-five.vercel.app',
  capabilities: [
    'Zvedá telefony 24/7, i když máte plné ruce práce',
    'Přijímá rezervace termínů a stolů',
    'Odpovídá na časté dotazy — otevírací dobu, ceny, adresu',
    'Zapisuje vzkazy, abyste o nic nepřišli',
  ],
  audience: [
    'Restaurace a kavárny',
    'Salony a studia',
    'Servisy a řemeslníci',
    'Malé firmy, které nestíhají telefon',
  ],
  // TODO: doplnit — postup nasazení ověří tým podle toho, jak Ariu reálně nasazuje.
  rollout: [
    { title: 'Úvodní hovor', text: 'Projdeme, jaké hovory vám chodí a co má Aria vyřizovat.' },
    {
      title: 'Nastavení',
      text: 'Naučíme Ariu vaše služby, ceny, otevírací dobu a pravidla rezervací.',
    },
    { title: 'Zkušební provoz', text: 'Vyzkoušíte si ji sami, než ji pustíte k zákazníkům.' },
    { title: 'Spuštění', text: 'Přesměrujete číslo a Aria začne zvedat telefony.' },
  ],
}
```

`content/process.ts`:

```ts
import type { Step } from './types'

export const processSteps: Step[] = [
  { title: 'Poptávka', text: 'Napíšete nám pár vět o projektu. Ozveme se do 24 hodin.' },
  { title: 'Návrh', text: 'Projdeme cíle, navrhneme řešení a řekneme cenu předem.' },
  { title: 'Výroba', text: 'Stavíme po částech, průběžně ukazujeme a ladíme podle vás.' },
  { title: 'Spuštění', text: 'Spustíme, předáme a zůstáváme k dispozici pro úpravy.' },
]
```

`lib/projects.ts`:

```ts
import { projects } from '@/content/projects'
import type { Market, Project } from '@/content/types'

export const MARKET_LABELS: Record<Market, string> = { SK: 'Slovensko', CZ: 'Česko' }

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1 || projects.length < 2) return undefined
  return projects[(index + 1) % projects.length]
}
```

- [ ] **Step 7: Spusti testy**

Run: `npm test`
Expected: PASS — `content/content.test.ts` a `lib/projects.test.ts`, všetky testy zelené.

- [ ] **Step 8: Lint a commit**

```bash
npm run lint
git add vitest.config.mts vitest.setup.ts package.json package-lock.json content lib/projects.ts lib/projects.test.ts
git commit -F - <<'MSG'
feat: add typed site content and Vitest setup

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 3: Obrázky — optimalizácia fotiek a screenshoty projektov

**Files:**
- Create: `scripts/optimize-images.mjs`, `scripts/capture-screenshots.mjs`
- Create (generated): `public/media/macbook.webp`, `public/media/phone.webp`, `public/projects/elevator-servis.webp`, `public/projects/esencia-viva.webp`
- Test: `content/assets.test.ts`

**Interfaces:**
- Consumes: `projects`, `PROJECT_IMAGE_SIZE` z `content/projects.ts`; `media` z `content/site.ts`.
- Produces: WebP súbory, na ktoré odkazuje obsah.

- [ ] **Step 1: Nainštaluj nástroje**

```bash
npm install -D sharp@^0.35.4 playwright-core@^1.63.0
```

- [ ] **Step 2: Napíš padajúci test obrázkov**

`content/assets.test.ts`:

```ts
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { PROJECT_IMAGE_SIZE, projects } from '@/content/projects'
import { media } from '@/content/site'

const publicFile = (src: string) => join(process.cwd(), 'public', src)
const MAX_BYTES = 400 * 1024

describe('project screenshots', () => {
  it.each(projects.map((p) => [p.slug, p.image] as const))(
    '%s has a 1440×900 WebP screenshot under 400 KB',
    async (_slug, image) => {
      const file = publicFile(image)
      expect(existsSync(file)).toBe(true)
      const { width, height, format } = await sharp(file).metadata()
      expect({ width, height, format }).toEqual({ ...PROJECT_IMAGE_SIZE, format: 'webp' })
      expect(statSync(file).size).toBeLessThan(MAX_BYTES)
    },
  )
})

describe('media', () => {
  it.each(Object.entries(media))('%s matches its declared size', async (_key, item) => {
    const file = publicFile(item.src)
    expect(existsSync(file)).toBe(true)
    const { width, height, format } = await sharp(file).metadata()
    expect({ width, height, format }).toEqual({ width: item.width, height: item.height, format: 'webp' })
    expect(statSync(file).size).toBeLessThan(MAX_BYTES)
  })
})
```

- [ ] **Step 3: Over, že test padá**

Run: `npx vitest run content/assets.test.ts`
Expected: FAIL — `expected false to be true` (súbory neexistujú).

- [ ] **Step 4: Skript na fotky**

`scripts/optimize-images.mjs`:

```js
// Converts the source photos in assets-src/ to WebP files in public/media/.
// Usage: node scripts/optimize-images.mjs
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const SOURCES = [
  { input: 'assets-src/macbook.png', output: 'public/media/macbook.webp' },
  { input: 'assets-src/phone.png', output: 'public/media/phone.webp' },
]

await mkdir('public/media', { recursive: true })

for (const { input, output } of SOURCES) {
  const info = await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output)
  console.log(`${output}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`)
}
```

- [ ] **Step 5: Skript na screenshoty**

`scripts/capture-screenshots.mjs` (používa Microsoft Edge nainštalovaný vo Windows — žiadne sťahovanie prehliadača):

```js
// Captures a 1440x900 screenshot of each site with the locally installed
// Microsoft Edge and saves it as public/projects/<slug>.webp.
// Usage: node scripts/capture-screenshots.mjs <slug>=<url> [<slug>=<url> ...]
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const VIEWPORT = { width: 1440, height: 900 }
const OUT_DIR = join('public', 'projects')

const targets = process.argv.slice(2).map((arg) => {
  const eq = arg.indexOf('=')
  if (eq < 1) throw new Error(`Invalid argument "${arg}", expected <slug>=<url>`)
  return { slug: arg.slice(0, eq), url: arg.slice(eq + 1) }
})

if (targets.length === 0) {
  console.error('Usage: node scripts/capture-screenshots.mjs <slug>=<url> ...')
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })

try {
  const context = await browser.newContext({ viewport: VIEWPORT, locale: 'cs-CZ' })
  for (const { slug, url } of targets) {
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    // Some sites open with an intro screen that Enter dismisses; harmless elsewhere.
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3_000)
    await page.mouse.move(0, 0)
    const png = await page.screenshot({ type: 'png' })
    const file = join(OUT_DIR, `${slug}.webp`)
    await sharp(png).webp({ quality: 80 }).toFile(file)
    console.log(`saved ${file}`)
    await page.close()
  }
} finally {
  await browser.close()
}
```

- [ ] **Step 6: Vygeneruj obrázky**

```bash
node scripts/optimize-images.mjs
node scripts/capture-screenshots.mjs elevator-servis=https://elevatorservis.sk esencia-viva=https://esenciaviva.cz
```

Expected: `public/media/macbook.webp: 1376x768, ~28 KB`, `public/media/phone.webp: 896x1200, ~23 KB`, `saved public\projects\elevator-servis.webp`, `saved public\projects\esencia-viva.webp`.

- [ ] **Step 7: Vizuálna kontrola screenshotov**

Otvor oba súbory `public/projects/*.webp` nástrojom Read (zobrazí obrázok). Každý musí ukazovať hlavnú (hero) obrazovku webu — Elevátor Servis s nadpisom „Servis výťahov v Banskej Bystrici…", Esencia Viva s nadpisom „Tělo nemusíte opravovat…". Ak je na niektorom prázdna/úvodná obrazovka alebo cookie lišta cez obsah, spusti skript pre daný slug znova.

- [ ] **Step 8: Testy**

Run: `npm test`
Expected: PASS (vrátane `content/assets.test.ts`).

- [ ] **Step 9: Commit**

```bash
git add scripts public/media public/projects content/assets.test.ts package.json package-lock.json
git commit -F - <<'MSG'
feat: add optimized photos and project screenshots

Photos drop from ~1 MB PNG to ~25 KB WebP each; project screenshots are
captured with the local Edge browser via playwright-core.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 4: Validácia dopytu (Zod)

**Files:**
- Create: `lib/inquiry-options.ts`, `lib/inquiry-schema.ts`, `lib/inquiry-email.ts`
- Test: `lib/inquiry-options.test.ts`, `lib/inquiry-schema.test.ts`, `lib/inquiry-email.test.ts`

**Interfaces:**
- Consumes: `SERVICE_IDS` z `content/types.ts`.
- Produces:
  - `lib/inquiry-options.ts` (bez zod, importuje ho klient): `INQUIRY_SERVICES`, `InquiryService`, `INQUIRY_SERVICE_LABELS`, `parseServiceParam(value: string | null | undefined): InquiryService | undefined`, `InquiryField`, `InquiryFieldErrors`, `InquiryState`, `INITIAL_INQUIRY_STATE`
  - `lib/inquiry-schema.ts`: `inquirySchema`, `Inquiry`, `ParseInquiryResult`, `parseInquiry(formData: FormData): ParseInquiryResult`, `isHoneypotFilled(formData: FormData): boolean`
  - `lib/inquiry-email.ts`: `INQUIRY_EMAIL_FROM`, `InquiryEmail`, `buildInquiryEmail(inquiry: Inquiry, to: string): InquiryEmail`

- [ ] **Step 1: Nainštaluj Zod**

```bash
npm install zod@^4.6.5
```

- [ ] **Step 2: Napíš padajúce testy**

`lib/inquiry-options.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { SERVICE_IDS } from '@/content/types'
import { INQUIRY_SERVICE_LABELS, INQUIRY_SERVICES, parseServiceParam } from '@/lib/inquiry-options'

describe('INQUIRY_SERVICES', () => {
  it('offers every service plus "jine"', () => {
    expect(INQUIRY_SERVICES).toEqual([...SERVICE_IDS, 'jine'])
  })

  it('has a Czech label for every option', () => {
    expect(Object.keys(INQUIRY_SERVICE_LABELS).sort()).toEqual([...INQUIRY_SERVICES].sort())
  })
})

describe('parseServiceParam', () => {
  it.each(['web', '3d', 'ai', 'konzultace', 'jine'])('accepts %s', (value) => {
    expect(parseServiceParam(value)).toBe(value)
  })

  it.each([null, undefined, '', 'eshop', 'AI'])('ignores %s', (value) => {
    expect(parseServiceParam(value)).toBeUndefined()
  })
})
```

`lib/inquiry-schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { isHoneypotFilled, parseInquiry } from '@/lib/inquiry-schema'

function form(values: Record<string, string>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) formData.set(key, value)
  return formData
}

const valid = {
  name: 'Jana Nováková',
  email: 'jana@example.cz',
  service: 'web',
  message: 'Potřebujeme nový web pro kavárnu.',
}

describe('parseInquiry', () => {
  it('accepts a valid inquiry', () => {
    expect(parseInquiry(form(valid))).toEqual({ success: true, data: valid })
  })

  it('trims whitespace around name and e-mail', () => {
    const result = parseInquiry(form({ ...valid, name: '  Jana Nováková ', email: ' jana@example.cz  ' }))
    expect(result).toEqual({ success: true, data: valid })
  })

  it('treats an empty service as not chosen', () => {
    const result = parseInquiry(form({ ...valid, service: '' }))
    expect(result).toEqual({ success: true, data: { ...valid, service: undefined } })
  })

  it('treats a missing service field as not chosen', () => {
    const formData = form(valid)
    formData.delete('service')
    expect(parseInquiry(formData)).toEqual({ success: true, data: { ...valid, service: undefined } })
  })

  it('rejects an unknown service', () => {
    expect(parseInquiry(form({ ...valid, service: 'eshop' }))).toEqual({
      success: false,
      fieldErrors: { service: ['Vyberte službu ze seznamu.'] },
    })
  })

  it('reports every missing required field', () => {
    expect(parseInquiry(new FormData())).toEqual({
      success: false,
      fieldErrors: {
        name: ['Vyplňte jméno.'],
        email: ['Vyplňte e-mail.'],
        message: ['Napište nám zprávu.'],
      },
    })
  })

  it('rejects an invalid e-mail', () => {
    expect(parseInquiry(form({ ...valid, email: 'jana(at)example.cz' }))).toEqual({
      success: false,
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
  })

  it('rejects a one-letter name', () => {
    expect(parseInquiry(form({ ...valid, name: 'J' }))).toEqual({
      success: false,
      fieldErrors: { name: ['Jméno musí mít alespoň 2 znaky.'] },
    })
  })

  it('rejects a name over 100 characters', () => {
    expect(parseInquiry(form({ ...valid, name: 'a'.repeat(101) }))).toEqual({
      success: false,
      fieldErrors: { name: ['Jméno může mít nejvýše 100 znaků.'] },
    })
  })

  it('rejects a message under 10 characters', () => {
    expect(parseInquiry(form({ ...valid, message: 'Ahoj' }))).toEqual({
      success: false,
      fieldErrors: { message: ['Zpráva musí mít alespoň 10 znaků.'] },
    })
  })

  it('accepts a message of exactly 5000 characters', () => {
    expect(parseInquiry(form({ ...valid, message: 'a'.repeat(5000) })).success).toBe(true)
  })

  it('rejects a message over 5000 characters', () => {
    expect(parseInquiry(form({ ...valid, message: 'a'.repeat(5001) }))).toEqual({
      success: false,
      fieldErrors: { message: ['Zpráva může mít nejvýše 5000 znaků.'] },
    })
  })
})

describe('isHoneypotFilled', () => {
  it('is false when the hidden field is missing or blank', () => {
    expect(isHoneypotFilled(new FormData())).toBe(false)
    expect(isHoneypotFilled(form({ website: '   ' }))).toBe(false)
  })

  it('is true when a bot filled the hidden field', () => {
    expect(isHoneypotFilled(form({ website: 'https://spam.example' }))).toBe(true)
  })
})
```

`lib/inquiry-email.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildInquiryEmail } from '@/lib/inquiry-email'
import type { Inquiry } from '@/lib/inquiry-schema'

const inquiry: Inquiry = {
  name: 'Jana Nováková',
  email: 'jana@example.cz',
  service: 'ai',
  message: 'Chceme Ariu.\nDruhý řádek.',
}

describe('buildInquiryEmail', () => {
  it('sends to our inbox and replies go to the visitor', () => {
    expect(buildInquiryEmail(inquiry, 'info.indiweb@gmail.com')).toEqual({
      from: 'IndiWeb <onboarding@resend.dev>',
      to: ['info.indiweb@gmail.com'],
      replyTo: 'jana@example.cz',
      subject: 'Nová poptávka — Jana Nováková (AI agent)',
      text: 'Jméno: Jana Nováková\nE-mail: jana@example.cz\nSlužba: AI agent\n\nZpráva:\nChceme Ariu.\nDruhý řádek.',
    })
  })

  it('says "Neuvedeno" when no service was chosen', () => {
    const email = buildInquiryEmail({ ...inquiry, service: undefined }, 'info.indiweb@gmail.com')
    expect(email.subject).toBe('Nová poptávka — Jana Nováková (Neuvedeno)')
    expect(email.text).toContain('Služba: Neuvedeno')
  })

  it('keeps the subject on a single line', () => {
    const email = buildInquiryEmail({ ...inquiry, name: 'Jana\r\nBcc: x@y.cz' }, 'info.indiweb@gmail.com')
    expect(email.subject).toBe('Nová poptávka — Jana Bcc: x@y.cz (AI agent)')
  })
})
```

- [ ] **Step 3: Over, že testy padajú**

Run: `npx vitest run lib/inquiry-options.test.ts lib/inquiry-schema.test.ts lib/inquiry-email.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/inquiry-options"`.

- [ ] **Step 4: Implementácia**

`lib/inquiry-options.ts`:

```ts
import { SERVICE_IDS } from '@/content/types'

// Kept free of zod: the client-side form imports this module.
export const INQUIRY_SERVICES = [...SERVICE_IDS, 'jine'] as const
export type InquiryService = (typeof INQUIRY_SERVICES)[number]

export const INQUIRY_SERVICE_LABELS: Record<InquiryService, string> = {
  web: 'Web',
  '3d': '3D / vizualizace',
  ai: 'AI agent',
  konzultace: 'Konzultace',
  jine: 'Jiné',
}

export function parseServiceParam(value: string | null | undefined): InquiryService | undefined {
  return INQUIRY_SERVICES.find((service) => service === value)
}

export type InquiryField = 'name' | 'email' | 'service' | 'message'
export type InquiryFieldErrors = Partial<Record<InquiryField, string[]>>

export type InquiryState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; fieldErrors: InquiryFieldErrors }
  | { status: 'error' }

export const INITIAL_INQUIRY_STATE: InquiryState = { status: 'idle' }
```

`lib/inquiry-schema.ts`:

```ts
import * as z from 'zod'
import { INQUIRY_SERVICES, type InquiryFieldErrors } from '@/lib/inquiry-options'

// FormData gives null for a missing field and '' for an empty <select>.
const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value)

export const inquirySchema = z.object({
  name: z
    .string({ error: 'Vyplňte jméno.' })
    .trim()
    .min(2, { error: 'Jméno musí mít alespoň 2 znaky.' })
    .max(100, { error: 'Jméno může mít nejvýše 100 znaků.' }),
  email: z
    .string({ error: 'Vyplňte e-mail.' })
    .trim()
    .pipe(z.email({ error: 'Zadejte platný e-mail.' })),
  service: z.preprocess(
    emptyToUndefined,
    z.enum(INQUIRY_SERVICES, { error: 'Vyberte službu ze seznamu.' }).optional(),
  ),
  message: z
    .string({ error: 'Napište nám zprávu.' })
    .trim()
    .min(10, { error: 'Zpráva musí mít alespoň 10 znaků.' })
    .max(5000, { error: 'Zpráva může mít nejvýše 5000 znaků.' }),
})

export type Inquiry = z.infer<typeof inquirySchema>

export type ParseInquiryResult =
  | { success: true; data: Inquiry }
  | { success: false; fieldErrors: InquiryFieldErrors }

export function parseInquiry(formData: FormData): ParseInquiryResult {
  const result = inquirySchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message'),
  })
  if (result.success) return { success: true, data: result.data }
  return { success: false, fieldErrors: z.flattenError(result.error).fieldErrors }
}

export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get('website')
  return typeof value === 'string' && value.trim() !== ''
}
```

`lib/inquiry-email.ts`:

```ts
import { INQUIRY_SERVICE_LABELS } from '@/lib/inquiry-options'
import type { Inquiry } from '@/lib/inquiry-schema'

// Resend's shared test sender; it can deliver only to the Resend account owner
// (info.indiweb@gmail.com). Switch to a verified domain once indiweb.cz exists.
export const INQUIRY_EMAIL_FROM = 'IndiWeb <onboarding@resend.dev>'

export type InquiryEmail = {
  from: string
  to: string[]
  replyTo: string
  subject: string
  text: string
}

const singleLine = (value: string) => value.replace(/\s+/g, ' ').trim()

export function buildInquiryEmail(inquiry: Inquiry, to: string): InquiryEmail {
  const service = inquiry.service ? INQUIRY_SERVICE_LABELS[inquiry.service] : 'Neuvedeno'
  return {
    from: INQUIRY_EMAIL_FROM,
    to: [to],
    replyTo: inquiry.email,
    subject: `Nová poptávka — ${singleLine(inquiry.name)} (${service})`,
    text: [
      `Jméno: ${inquiry.name}`,
      `E-mail: ${inquiry.email}`,
      `Služba: ${service}`,
      '',
      'Zpráva:',
      inquiry.message,
    ].join('\n'),
  }
}
```

- [ ] **Step 5: Testy**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Lint a commit**

```bash
npm run lint
git add lib/inquiry-options.ts lib/inquiry-options.test.ts lib/inquiry-schema.ts lib/inquiry-schema.test.ts lib/inquiry-email.ts lib/inquiry-email.test.ts package.json package-lock.json
git commit -F - <<'MSG'
feat: validate inquiries with zod and build the notification e-mail

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 5: Server Action `sendInquiry` (Resend)

**Files:**
- Create: `app/actions/send-inquiry.ts`, `.env.example`
- Test: `app/actions/send-inquiry.test.ts`

**Interfaces:**
- Consumes: `parseInquiry`, `isHoneypotFilled` (Task 4), `buildInquiryEmail` (Task 4), `InquiryState` (Task 4), `site.email` (Task 2).
- Produces: `sendInquiry(previous: InquiryState, formData: FormData): Promise<InquiryState>` — jediný export súboru s `'use server'`.

- [ ] **Step 1: Nainštaluj Resend**

```bash
npm install resend@^6.28.1
```

- [ ] **Step 2: Napíš padajúci test**

`app/actions/send-inquiry.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))

vi.mock('resend', () => ({
  Resend: vi.fn(
    class {
      emails = { send: sendMock }
    },
  ),
}))

import { sendInquiry } from '@/app/actions/send-inquiry'
import { INITIAL_INQUIRY_STATE } from '@/lib/inquiry-options'

function inquiryForm(overrides: Record<string, string> = {}) {
  const values = {
    name: 'Jana Nováková',
    email: 'jana@example.cz',
    service: 'web',
    message: 'Potřebujeme nový web pro kavárnu.',
    website: '',
    ...overrides,
  }
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) formData.set(key, value)
  return formData
}

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 're_test_123')
  sendMock.mockReset()
  sendMock.mockResolvedValue({ data: { id: 'email_1' }, error: null, headers: null })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('sendInquiry', () => {
  it('e-mails a valid inquiry to the IndiWeb inbox', async () => {
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'success',
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['info.indiweb@gmail.com'],
        replyTo: 'jana@example.cz',
        subject: 'Nová poptávka — Jana Nováková (Web)',
      }),
    )
  })

  it('returns field errors and sends nothing for invalid input', async () => {
    const state = await sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm({ email: 'spatne' }))
    expect(state).toEqual({
      status: 'invalid',
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('pretends success for bots that fill the honeypot', async () => {
    await expect(
      sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm({ website: 'https://spam.example' })),
    ).resolves.toEqual({ status: 'success' })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('fails gracefully when the API key is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', undefined)
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'error',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('reports an error when Resend rejects the e-mail', async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { name: 'validation_error', message: 'bad', statusCode: 422 },
      headers: null,
    })
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'error',
    })
  })

  it('reports an error when sending throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('network down'))
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'error',
    })
  })
})
```

- [ ] **Step 3: Over, že test padá**

Run: `npx vitest run app/actions/send-inquiry.test.ts`
Expected: FAIL — `Failed to resolve import "@/app/actions/send-inquiry"`.

- [ ] **Step 4: Implementácia**

`app/actions/send-inquiry.ts`:

```ts
'use server'

import { Resend } from 'resend'
import { site } from '@/content/site'
import { buildInquiryEmail } from '@/lib/inquiry-email'
import type { InquiryState } from '@/lib/inquiry-options'
import { isHoneypotFilled, parseInquiry } from '@/lib/inquiry-schema'

export async function sendInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Bots fill the hidden field; report success so they do not retry.
  if (isHoneypotFilled(formData)) return { status: 'success' }

  const parsed = parseInquiry(formData)
  if (!parsed.success) return { status: 'invalid', fieldErrors: parsed.fieldErrors }

  // Read the key per request: the Resend constructor throws when it is missing.
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[sendInquiry] RESEND_API_KEY is not set')
    return { status: 'error' }
  }

  try {
    // Resend returns API failures as { error } instead of throwing.
    const { error } = await new Resend(apiKey).emails.send(
      buildInquiryEmail(parsed.data, site.email),
    )
    if (error) {
      console.error('[sendInquiry] Resend rejected the e-mail', error)
      return { status: 'error' }
    }
    return { status: 'success' }
  } catch (error) {
    console.error('[sendInquiry] Sending failed', error)
    return { status: 'error' }
  }
}
```

`.env.example`:

```bash
# Resend API key (https://resend.com/api-keys). The Resend account must be
# registered to info.indiweb@gmail.com - the shared test sender can only
# deliver to the account owner. Set it in Vercel for Production and Preview.
RESEND_API_KEY=
```

- [ ] **Step 5: Testy a lint**

Run: `npm test && npm run lint`
Expected: PASS, lint bez chýb.

- [ ] **Step 6: Commit**

```bash
git add app/actions .env.example package.json package-lock.json
git commit -F - <<'MSG'
feat: send inquiries through a Resend server action

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 6: Dizajnový systém a základné UI prvky

**Files:**
- Modify (replace): `app/globals.css`, `app/layout.tsx`
- Create: `lib/cn.ts`, `lib/use-reduced-motion.ts`, `components/ui/container.tsx`, `components/ui/button-link.tsx`, `components/ui/section-heading.tsx`, `components/ui/reveal.tsx`, `components/ui/browser-frame.tsx`, `components/ui/bullet-list.tsx`, `components/ui/tag-list.tsx`, `components/ui/step-list.tsx`
- Test: `lib/cn.test.ts`, `lib/use-reduced-motion.test.tsx`, `components/ui/button-link.test.tsx`, `components/ui/reveal.test.tsx`, `components/ui/section-heading.test.tsx`, `components/ui/lists.test.tsx`

**Interfaces:**
- Consumes: `site` (Task 2).
- Produces:
  - `cn(...classes: Array<string | false | null | undefined>): string`
  - `useReducedMotion(): boolean`
  - `<Container className? children>`
  - `<ButtonLink href children variant?: 'primary' | 'ghost' external? withArrow? className?>` — externý odkaz: `target="_blank" rel="noopener noreferrer"` + skrytý text „(otevře se v novém okně)"
  - `<SectionHeading id eyebrow title lead? align?: 'left' | 'center'>` — renderuje `<h2 id={id}>`
  - `<Reveal className? delay?: number children>` — trieda `reveal`, po zobrazení `is-visible`
  - `<BrowserFrame url? className? children>`
  - `<BulletList items: string[] className?>` — `<ul>` s bodkou pred každou položkou (služby, Aria, detail projektu)
  - `<TagList tags: string[] className?>` — `<ul aria-label="Štítky">` so štítkami (karta aj detail projektu)
  - `<StepList steps: Step[] className?>` — `<ol>` očíslovaných kariet s `<h3>` (postup spolupráce, nasadenie Arie)
  - CSS triedy `ambient-glow`, `ambient-grain`, `reveal`, `is-visible`; tokeny farieb a `font-display`

- [ ] **Step 1: Napíš padajúce testy**

`lib/cn.test.ts`:

```ts
import { expect, it } from 'vitest'
import { cn } from '@/lib/cn'

it('joins truthy class names and skips the rest', () => {
  expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
})
```

`lib/use-reduced-motion.test.tsx`:

```tsx
// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useReducedMotion } from '@/lib/use-reduced-motion'

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}

it('is false when the browser has no matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
})

it('follows the prefers-reduced-motion media query', () => {
  stubMatchMedia(true)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
  stubMatchMedia(false)
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
})
```

`components/ui/button-link.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ButtonLink } from '@/components/ui/button-link'

it('renders an internal link in the same tab', () => {
  render(<ButtonLink href="/aria">Více o Arii</ButtonLink>)
  const link = screen.getByRole('link', { name: 'Více o Arii' })
  expect(link.getAttribute('href')).toBe('/aria')
  expect(link.getAttribute('target')).toBeNull()
})

it('opens an external link in a new tab and says so', () => {
  render(
    <ButtonLink href="https://aria-eta-five.vercel.app" external withArrow>
      Vyzkoušet Ariu
    </ButtonLink>,
  )
  const link = screen.getByRole('link', { name: 'Vyzkoušet Ariu (otevře se v novém okně)' })
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toBe('noopener noreferrer')
})
```

`components/ui/reveal.test.tsx`:

```tsx
// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { Reveal } from '@/components/ui/reveal'

it('shows content right away when IntersectionObserver is missing', () => {
  render(
    <Reveal>
      <p>Obsah</p>
    </Reveal>,
  )
  expect(screen.getByText('Obsah').parentElement?.classList.contains('is-visible')).toBe(true)
})

it('reveals content once it scrolls into view', () => {
  const observers: Array<{ callback: IntersectionObserverCallback }> = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        observers.push(this)
      }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    },
  )

  render(
    <Reveal>
      <p>Obsah</p>
    </Reveal>,
  )
  const wrapper = screen.getByText('Obsah').parentElement as HTMLElement
  expect(wrapper.classList.contains('is-visible')).toBe(false)

  act(() => {
    observers[0].callback(
      [{ isIntersecting: true, target: wrapper } as unknown as IntersectionObserverEntry],
      observers[0] as unknown as IntersectionObserver,
    )
  })
  expect(wrapper.classList.contains('is-visible')).toBe(true)
})
```

`components/ui/section-heading.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { SectionHeading } from '@/components/ui/section-heading'

it('renders the eyebrow, an h2 with the given id and the lead', () => {
  render(<SectionHeading id="sluzby-nadpis" eyebrow="Co děláme" title="Web je základ." lead="Úvod" />)
  const heading = screen.getByRole('heading', { level: 2, name: 'Web je základ.' })
  expect(heading.id).toBe('sluzby-nadpis')
  expect(screen.getByText('Co děláme')).toBeTruthy()
  expect(screen.getByText('Úvod')).toBeTruthy()
})
```

`components/ui/lists.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BulletList } from '@/components/ui/bullet-list'
import { StepList } from '@/components/ui/step-list'
import { TagList } from '@/components/ui/tag-list'

describe('BulletList', () => {
  it('renders one list item per entry', () => {
    render(<BulletList items={['Rezervace', 'E-shop']} />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Rezervace', 'E-shop'])
  })
})

describe('TagList', () => {
  it('renders a labelled list of tags', () => {
    render(<TagList tags={['Web', 'B2B']} />)
    const list = screen.getByRole('list', { name: 'Štítky' })
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Web', 'B2B'])
  })
})

describe('StepList', () => {
  it('renders an ordered list with a heading per step', () => {
    const steps = [
      { title: 'Poptávka', text: 'Napíšete nám.' },
      { title: 'Návrh', text: 'Navrhneme řešení.' },
    ]
    const { container } = render(<StepList steps={steps} />)
    expect(container.querySelector('ol')).not.toBeNull()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Poptávka',
      'Návrh',
    ])
    expect(screen.getByText('Navrhneme řešení.')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Over, že testy padajú**

Run: `npm test`
Expected: FAIL — chýbajúce moduly `@/lib/cn`, `@/components/ui/...`.

- [ ] **Step 3: Pomocné funkcie**

`lib/cn.ts`:

```ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
```

`lib/use-reduced-motion.ts`:

```ts
import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const mediaQuery = window.matchMedia(QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getSnapshot() {
  return typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

/** True when the visitor asked the OS to reduce motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
```

- [ ] **Step 4: UI komponenty**

`components/ui/container.tsx`:

```tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
}
```

`components/ui/button-link.tsx`:

```tsx
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  external?: boolean
  withArrow?: boolean
  className?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300'

const VARIANTS = {
  primary: 'bg-accent text-bg hover:bg-accent-strong',
  ghost: 'border border-line-strong text-fg hover:border-fg-faint hover:bg-surface',
}

function Arrow({ external }: { external: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {external ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  withArrow = false,
  className,
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], className)
  const content = (
    <>
      {children}
      {withArrow && <Arrow external={external} />}
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
        <span className="sr-only"> (otevře se v novém okně)</span>
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
```

`components/ui/section-heading.tsx`:

```tsx
import { cn } from '@/lib/cn'

type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ id, eyebrow, title, lead, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl"
      >
        {title}
      </h2>
      {lead && <p className="mt-5 text-lg text-pretty text-fg-dim">{lead}</p>}
    </div>
  )
}
```

`components/ui/reveal.tsx` (trieda sa pridáva priamo na DOM, bez React stavu — žiadne preblikávanie po hydratácii):

```tsx
'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type RevealProps = { children: ReactNode; className?: string; delay?: number }

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
```

`components/ui/browser-frame.tsx`:

```tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BrowserFrameProps = { children: ReactNode; url?: string; className?: string }

export function BrowserFrame({ children, url, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-line-strong bg-bg-soft shadow-2xl shadow-black/50',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-fg-faint/40" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-fg-faint/40" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-fg-faint/40" />
        {url && (
          <span className="ml-3 truncate rounded-md bg-surface px-3 py-1 text-xs text-fg-faint">
            {url}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
```

`components/ui/bullet-list.tsx`:

```tsx
import { cn } from '@/lib/cn'

export function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}
```

`components/ui/tag-list.tsx`:

```tsx
import { cn } from '@/lib/cn'

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul aria-label="Štítky" className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-fg-dim">
          {tag}
        </li>
      ))}
    </ul>
  )
}
```

`components/ui/step-list.tsx`:

```tsx
import type { Step } from '@/content/types'
import { cn } from '@/lib/cn'
import { Reveal } from './reveal'

export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-4', className)}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal delay={index * 100} className="h-full">
            <div className="h-full rounded-3xl border border-line bg-surface p-7">
              <p aria-hidden="true" className="font-display text-sm text-accent">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-fg-dim">{step.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
```

- [ ] **Step 5: Globálne štýly**

Nahraď celý `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #08080a;
  --color-bg-soft: #0e0e11;
  --color-fg: #f4f4f6;
  --color-fg-dim: #a0a0aa;
  --color-fg-faint: #85858f;
  --color-accent: #8b92ff;
  --color-accent-strong: #a9aeff;
  --color-line: rgb(255 255 255 / 0.08);
  --color-line-strong: rgb(255 255 255 / 0.16);
  --color-surface: rgb(255 255 255 / 0.03);
  --color-danger: #ff8a8a;
  --color-success: #7ee2b8;

  --animate-word-in: word-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;

  @keyframes word-in {
    from {
      opacity: 0;
      transform: translateY(0.35em);
      filter: blur(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }
}

@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-bricolage), var(--font-inter), ui-sans-serif, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  section[id] {
    scroll-margin-top: 5rem;
  }

  ::selection {
    background: rgb(139 146 255 / 0.3);
    color: #ffffff;
  }

  :focus-visible {
    outline: 2px solid #8b92ff;
    outline-offset: 3px;
  }

  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}

@layer components {
  .ambient-glow {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(60% 50% at 50% -10%, rgb(120 130 255 / 0.14), transparent 70%),
      radial-gradient(50% 40% at 85% 110%, rgb(255 180 120 / 0.06), transparent 70%);
  }

  .ambient-grain {
    position: fixed;
    inset: -50%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal.is-visible {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 6: Root layout**

Nahraď celý `app/layout.tsx` (Header/Footer pribudnú v Task 7):

```tsx
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { site } from '@/content/site'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })
const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
}

export const viewport: Viewport = { themeColor: '#08080a' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" className={`${inter.variable} ${bricolage.variable}`}>
      <head>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <div aria-hidden="true" className="ambient-glow" />
        <div aria-hidden="true" className="ambient-grain" />
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Přeskočit na obsah
        </a>
        <main id="obsah" className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: všetko PASS; build bez chýb.

- [ ] **Step 8: Commit**

```bash
git add app/globals.css app/layout.tsx lib/cn.ts lib/cn.test.ts lib/use-reduced-motion.ts lib/use-reduced-motion.test.tsx components/ui
git commit -F - <<'MSG'
feat: add design tokens, fonts and base UI components

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 7: Header, Footer a stránka 404

**Files:**
- Create: `components/layout/header.tsx`, `components/layout/footer.tsx`, `app/not-found.tsx`
- Modify: `app/layout.tsx` (vložiť `<Header />` pred `<main>` a `<Footer />` za `</main>`)
- Test: `components/layout/header.test.tsx`, `components/layout/footer.test.tsx`

**Interfaces:**
- Consumes: `navigation`, `contactHref`, `site` (Task 2); `Container`, `ButtonLink`, `cn` (Task 6).
- Produces: `<Header />` (client; nav „Hlavní navigace", mobilné menu `#mobilni-menu`, atribút `data-scrolled`), `<Footer />`.

- [ ] **Step 1: Napíš padajúce testy**

`components/layout/header.test.tsx`:

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/layout/header'
import { navigation } from '@/content/site'

describe('Header', () => {
  it('links to every home page section', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Hlavní navigace' })
    for (const item of navigation) {
      expect(within(nav).getByRole('link', { name: item.label }).getAttribute('href')).toBe(item.href)
    }
  })

  it('offers a contact call to action', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('/#kontakt')
  })

  it('opens and closes the mobile menu', () => {
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Otevřít menu' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle)
    const mobileNav = screen.getByRole('navigation', { name: 'Mobilní navigace' })
    expect(screen.getByRole('button', { name: 'Zavřít menu' }).getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(within(mobileNav).getByRole('link', { name: 'Projekty' }))
    expect(screen.queryByRole('navigation', { name: 'Mobilní navigace' })).toBeNull()
  })

  it('closes the mobile menu on Escape', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Otevřít menu' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Mobilní navigace' })).toBeNull()
  })

  it('marks itself as scrolled after the page moves', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header') as HTMLElement
    expect(header.dataset.scrolled).toBe('false')
    Object.defineProperty(window, 'scrollY', { value: 120, configurable: true })
    fireEvent.scroll(window)
    expect(header.dataset.scrolled).toBe('true')
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })
})
```

`components/layout/footer.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Footer } from '@/components/layout/footer'

it('shows the current year and the contact e-mail', () => {
  render(<Footer />)
  expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} IndiWeb`))).toBeTruthy()
  expect(screen.getByRole('link', { name: 'info.indiweb@gmail.com' }).getAttribute('href')).toBe(
    'mailto:info.indiweb@gmail.com',
  )
})
```

- [ ] **Step 2: Over, že testy padajú**

Run: `npx vitest run components/layout`
Expected: FAIL — chýbajúce moduly.

- [ ] **Step 3: Header**

`components/layout/header.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/container'
import { contactHref, navigation, site } from '@/content/site'
import { cn } from '@/lib/cn'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)
  const solid = scrolled || open

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        solid ? 'border-line bg-bg/80 backdrop-blur-xl' : 'border-transparent',
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-fg shadow-[0_0_14px_1px_rgb(255_255_255/0.7)]"
          />
          {site.name}
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-fg-dim">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={contactHref}
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent-strong sm:inline-flex"
          >
            Napište nám
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobilni-menu"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg md:hidden"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobilni-menu" aria-label="Mobilní navigace" className="border-t border-line md:hidden">
          <Container>
            <ul className="flex flex-col py-4">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="block py-3 text-lg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Footer a 404**

`components/layout/footer.tsx`:

```tsx
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { navigation, site } from '@/content/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 text-sm text-fg-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. Tvoříme s péčí.
        </p>
        <nav aria-label="Patička">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                {site.email}
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
```

`app/not-found.tsx`:

```tsx
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-start justify-center gap-6 pt-32 pb-20">
      <p className="text-sm tracking-[0.2em] text-fg-faint uppercase">Chyba 404</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        Tahle stránka neexistuje.
      </h1>
      <p className="max-w-lg text-fg-dim">
        Možná byla přesunuta, nebo je v odkazu překlep. Zkuste to z úvodní stránky.
      </p>
      <ButtonLink href="/" withArrow>
        Zpět na úvod
      </ButtonLink>
    </Container>
  )
}
```

- [ ] **Step 5: Zapoj Header a Footer do layoutu**

V `app/layout.tsx` pridaj importy:

```tsx
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
```

a obal `<main>`:

```tsx
        <Header />
        <main id="obsah" className="relative z-10">
          {children}
        </main>
        <Footer />
```

- [ ] **Step 6: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS; build vypíše aj route `/_not-found`.

- [ ] **Step 7: Commit**

```bash
git add components/layout app/not-found.tsx app/layout.tsx
git commit -F - <<'MSG'
feat: add header with mobile menu, footer and 404 page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 8: Úvod — Hero, Služby, Aria

**Files:**
- Create: `components/home/rotating-word.tsx`, `components/home/hero.tsx`, `components/home/services.tsx`, `components/home/aria-teaser.tsx`
- Modify (replace): `app/page.tsx`
- Test: `components/home/rotating-word.test.tsx`, `components/home/hero.test.tsx`, `components/home/services.test.tsx`, `components/home/aria-teaser.test.tsx`

**Interfaces:**
- Consumes: `hero`, `media` (Task 2), `services` (Task 2), `aria` (Task 2), `useReducedMotion`, `Container`, `ButtonLink`, `SectionHeading`, `Reveal`, `BulletList` (Task 6).
- Produces: `<RotatingWord words interval?>` (animované slovo má atribút `data-rotating-word`), `<Hero />`, `<Services />` (`#sluzby`), `<AriaTeaser />` (`#aria`).

- [ ] **Step 1: Napíš padajúce testy**

`components/home/rotating-word.test.tsx`:

```tsx
// @vitest-environment jsdom
import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { RotatingWord } from '@/components/home/rotating-word'

const WORDS = ['prodávají', 'zaujmou', 'pracují za vás']

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function currentWord(container: HTMLElement) {
  return container.querySelector('[data-rotating-word]')?.textContent
}

it('cycles through the words and wraps around', () => {
  const { container } = render(<RotatingWord words={WORDS} interval={2200} />)
  expect(currentWord(container)).toBe('prodávají')
  act(() => vi.advanceTimersByTime(2200))
  expect(currentWord(container)).toBe('zaujmou')
  act(() => vi.advanceTimersByTime(2200))
  expect(currentWord(container)).toBe('pracují za vás')
  act(() => vi.advanceTimersByTime(2200))
  expect(currentWord(container)).toBe('prodávají')
})

it('keeps the first word for screen readers', () => {
  const { container } = render(<RotatingWord words={WORDS} />)
  expect(container.querySelector('.sr-only')?.textContent).toBe('prodávají')
})

it('stays on the first word when the visitor prefers reduced motion', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  const { container } = render(<RotatingWord words={WORDS} interval={2200} />)
  act(() => vi.advanceTimersByTime(6600))
  expect(currentWord(container)).toBe('prodávají')
})
```

`components/home/hero.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Hero } from '@/components/home/hero'

it('introduces IndiWeb and points to contact and projects', () => {
  render(<Hero />)
  expect(
    screen.getByRole('heading', { level: 1, name: /Weby a digitální zážitky, které\s+prodávají/ }),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Napište nám' }).getAttribute('href')).toBe('#kontakt')
  expect(screen.getByRole('link', { name: 'Ukázky práce' }).getAttribute('href')).toBe('#projekty')
})
```

`components/home/services.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Services } from '@/components/home/services'
import { services } from '@/content/services'

it('shows the web first, then the other services', () => {
  render(<Services />)
  expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
    'Weby na míru',
    '3D a Gaussian splaty',
    'AI agenti a integrace',
    'Konzultace',
  ])
})

it('lists every point of every service', () => {
  render(<Services />)
  for (const service of services) {
    for (const point of service.points) expect(screen.getByText(point)).toBeTruthy()
  }
})

it('is reachable as the #sluzby section', () => {
  const { container } = render(<Services />)
  expect(container.querySelector('section#sluzby')).not.toBeNull()
})
```

`components/home/aria-teaser.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { aria } from '@/content/aria'

it('presents Aria as our own product with links to its page and demo', () => {
  const { container } = render(<AriaTeaser />)
  expect(container.querySelector('section#aria')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 2, name: 'Aria — náš AI hlasový agent' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Více o Arii' }).getAttribute('href')).toBe('/aria')
  const demo = screen.getByRole('link', { name: /Vyzkoušet Ariu/ })
  expect(demo.getAttribute('href')).toBe(aria.url)
  expect(demo.getAttribute('target')).toBe('_blank')
})
```

- [ ] **Step 2: Over, že testy padajú**

Run: `npx vitest run components/home`
Expected: FAIL — chýbajúce moduly.

- [ ] **Step 3: RotatingWord a Hero**

`components/home/rotating-word.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

type RotatingWordProps = { words: readonly string[]; interval?: number }

export function RotatingWord({ words, interval = 2200 }: RotatingWordProps) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion || words.length < 2) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => window.clearInterval(id)
  }, [reducedMotion, words.length, interval])

  const word = words[reducedMotion ? 0 : index]

  return (
    <span className="relative inline-block text-accent">
      <span className="sr-only">{words[0]}</span>
      <span key={word} aria-hidden="true" data-rotating-word className="inline-block motion-safe:animate-word-in">
        {word}
      </span>
    </span>
  )
}
```

`components/home/hero.tsx`:

```tsx
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { hero } from '@/content/site'
import { RotatingWord } from './rotating-word'

export function Hero() {
  return (
    <section aria-labelledby="hero-nadpis">
      <Container className="flex min-h-svh flex-col items-center justify-center pt-28 pb-20 text-center">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-1.5 text-xs tracking-[0.18em] text-fg-dim uppercase">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {hero.eyebrow}
        </p>
        <h1
          id="hero-nadpis"
          className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-7xl"
        >
          {hero.titleLead}{' '}
          <span className="block">
            {hero.titleRotatingPrefix} <RotatingWord words={hero.rotatingWords} />
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-pretty text-fg-dim">{hero.subtitle}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#kontakt" withArrow>
            Napište nám
          </ButtonLink>
          <ButtonLink href="#projekty" variant="ghost">
            Ukázky práce
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-fg-faint">{hero.hint}</p>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Služby a Aria**

`components/home/services.tsx`:

```tsx
import Image from 'next/image'
import { BulletList } from '@/components/ui/bullet-list'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { services } from '@/content/services'
import { media } from '@/content/site'

export function Services() {
  const featured = services.find((service) => service.featured)
  const others = services.filter((service) => !service.featured)

  return (
    <section id="sluzby" aria-labelledby="sluzby-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="sluzby-nadpis"
          eyebrow="Co děláme"
          title="Web je základ. 3D a AI jsou důvod, proč bude lepší."
          lead="Navrhujeme a stavíme weby na míru. A když to dává smysl, přidáme 3D, splaty nebo AI agenta, který za vás odvede kus práce."
        />

        {featured && (
          <Reveal className="mt-14">
            <article className="grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <p className="text-xs tracking-[0.2em] text-accent uppercase">Hlavní služba</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-fg-dim">{featured.summary}</p>
                <BulletList items={featured.points} className="mt-8 text-sm text-fg-dim" />
              </div>
              <div className="relative min-h-64 lg:min-h-full">
                <Image
                  src={media.laptop.src}
                  alt={media.laptop.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </article>
          </Reveal>
        )}

        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {others.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={index * 100} className="h-full">
                <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-8">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-fg-dim">{service.summary}</p>
                  <BulletList items={service.points} className="mt-6 text-sm text-fg-dim" />
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

`components/home/aria-teaser.tsx`:

```tsx
import Image from 'next/image'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { aria } from '@/content/aria'
import { media } from '@/content/site'

export function AriaTeaser() {
  return (
    <section id="aria" aria-labelledby="aria-nadpis" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-accent/30 bg-linear-to-br from-accent/15 via-bg-soft to-bg p-8 sm:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-xs tracking-[0.2em] text-accent uppercase">Náš vlastní produkt</p>
                <h2
                  id="aria-nadpis"
                  className="mt-4 font-display text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl"
                >
                  {aria.headline}
                </h2>
                <p className="mt-5 text-lg text-fg-dim">{aria.description}</p>
                <BulletList items={aria.capabilities.slice(0, 3)} className="mt-8 text-sm" />
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/aria" withArrow>
                    Více o Arii
                  </ButtonLink>
                  <ButtonLink href={aria.url} external variant="ghost" withArrow>
                    Vyzkoušet Ariu
                  </ButtonLink>
                </div>
              </div>
              <Image
                src={media.phone.src}
                alt={media.phone.alt}
                width={media.phone.width}
                height={media.phone.height}
                sizes="(min-width: 1024px) 35vw, 80vw"
                className="mx-auto h-auto w-full max-w-sm"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
```

- [ ] **Step 5: Úvodná stránka**

Nahraď `app/page.tsx`:

```tsx
import { AriaTeaser } from '@/components/home/aria-teaser'
import { Hero } from '@/components/home/hero'
import { Services } from '@/components/home/services'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <AriaTeaser />
    </>
  )
}
```

- [ ] **Step 6: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/home app/page.tsx
git commit -F - <<'MSG'
feat: add hero, services and Aria sections to the home page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 9: Úvod — Projekty, Postup, Tím

**Files:**
- Create: `components/home/project-card.tsx`, `components/home/projects.tsx`, `components/home/process.tsx`, `components/home/team-card.tsx`, `components/home/team.tsx`
- Modify: `app/page.tsx`
- Test: `components/home/project-card.test.tsx`, `components/home/process.test.tsx`, `components/home/team-card.test.tsx`

**Interfaces:**
- Consumes: `projects`, `PROJECT_IMAGE_SIZE`, `processSteps`, `team` (Task 2); `MARKET_LABELS` (Task 2); `BrowserFrame`, `Container`, `SectionHeading`, `Reveal`, `TagList`, `StepList`, `cn` (Task 6).
- Produces: `<ProjectCard project>`, `<Projects />` (`#projekty`), `<Process />` (`#postup`), `<TeamCard member>`, `getInitials(name: string): string`, `<Team />` (`#o-nas`).

- [ ] **Step 1: Napíš padajúce testy**

`components/home/project-card.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ProjectCard } from '@/components/home/project-card'
import { projects } from '@/content/projects'

const project = projects[0]

it('links the title to the case study', () => {
  render(<ProjectCard project={project} />)
  expect(screen.getByRole('link', { name: project.title }).getAttribute('href')).toBe(
    `/projekty/${project.slug}`,
  )
})

it('opens the live site in a new tab', () => {
  render(<ProjectCard project={project} />)
  const live = screen.getByRole('link', { name: /Živá ukázka/ })
  expect(live.getAttribute('href')).toBe(project.liveUrl)
  expect(live.getAttribute('target')).toBe('_blank')
  expect(live.getAttribute('rel')).toBe('noopener noreferrer')
})

it('shows the screenshot, host, client and market', () => {
  render(<ProjectCard project={project} />)
  expect(screen.getByAltText(`Úvodní obrazovka webu ${project.title}`)).toBeTruthy()
  expect(screen.getByText('elevatorservis.sk')).toBeTruthy()
  expect(screen.getByText('Servis výtahů · Banská Bystrica · Slovensko')).toBeTruthy()
})
```

`components/home/process.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Process } from '@/components/home/process'
import { processSteps } from '@/content/process'

it('lists the four steps in order', () => {
  render(<Process />)
  const items = within(screen.getByRole('list')).getAllByRole('listitem')
  expect(items).toHaveLength(4)
  processSteps.forEach((step, index) => {
    expect(within(items[index]).getByRole('heading', { level: 3, name: step.title })).toBeTruthy()
  })
})
```

`components/home/team-card.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getInitials, TeamCard } from '@/components/home/team-card'
import type { TeamMember } from '@/content/types'

const denis: TeamMember = {
  slug: 'denis',
  name: 'Denis Mitrović',
  role: 'Spoluzakladatel',
  bio: 'Bio',
  website: 'https://mojweb2.vercel.app',
}

describe('TeamCard', () => {
  it('links to the personal website in a new tab', () => {
    render(<TeamCard member={denis} />)
    const link = screen.getByRole('link', { name: /Denis Mitrović/ })
    expect(link.getAttribute('href')).toBe('https://mojweb2.vercel.app')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(screen.getByText('DM')).toBeTruthy()
  })

  it('is a plain card without a website', () => {
    render(<TeamCard member={{ ...denis, website: undefined, name: 'Adam', slug: 'adam' }} />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByRole('heading', { level: 3, name: 'Adam' })).toBeTruthy()
  })
})

describe('getInitials', () => {
  it.each([
    ['Denis Mitrović', 'DM'],
    ['Adam', 'A'],
    ['  ondra  ', 'O'],
  ])('%s → %s', (name, initials) => {
    expect(getInitials(name)).toBe(initials)
  })
})
```

- [ ] **Step 2: Over, že testy padajú**

Run: `npx vitest run components/home`
Expected: FAIL — chýbajúce moduly `project-card`, `process`, `team-card`.

- [ ] **Step 3: Projekty**

`components/home/project-card.tsx` (celá karta je klikateľná cez `after:inset-0` na odkaze v nadpise; „Živá ukázka" leží nad ňou cez `relative z-10`, aby sa nevnárali odkazy):

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { TagList } from '@/components/ui/tag-list'
import { PROJECT_IMAGE_SIZE } from '@/content/projects'
import type { Project } from '@/content/types'
import { MARKET_LABELS } from '@/lib/projects'

export function ProjectCard({ project }: { project: Project }) {
  const host = new URL(project.liveUrl).host

  return (
    <article className="group relative flex flex-col gap-6">
      <BrowserFrame
        url={host}
        className="transition-transform duration-500 motion-safe:group-hover:-translate-y-1"
      >
        <Image
          src={project.image}
          alt={`Úvodní obrazovka webu ${project.title}`}
          width={PROJECT_IMAGE_SIZE.width}
          height={PROJECT_IMAGE_SIZE.height}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </BrowserFrame>
      <div>
        <p className="text-xs tracking-[0.18em] text-fg-faint uppercase">
          {project.client} · {MARKET_LABELS[project.market]}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          <Link href={`/projekty/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-fg-dim">{project.summary}</p>
        <TagList tags={project.tags} className="mt-4" />
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-strong"
        >
          Živá ukázka <span aria-hidden="true">↗</span>
          <span className="sr-only"> (otevře se v novém okně)</span>
        </a>
      </div>
    </article>
  )
}
```

`components/home/projects.tsx`:

```tsx
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { projects } from '@/content/projects'
import { ProjectCard } from './project-card'

export function Projects() {
  return (
    <section id="projekty" aria-labelledby="projekty-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="projekty-nadpis"
          eyebrow="Projekty"
          title="Každý klient dostane web, který sedí jemu. Ne šabloně."
          lead="Výtahová firma potřebuje něco jiného než terapeutka. Podívejte se, jak to vypadá v praxi."
        />
        <ul className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Reveal delay={index * 120}>
                <ProjectCard project={project} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 4: Postup a tím**

`components/home/process.tsx`:

```tsx
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { processSteps } from '@/content/process'

export function Process() {
  return (
    <section id="postup" aria-labelledby="postup-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="postup-nadpis"
          eyebrow="Jak pracujeme"
          title="Od první zprávy po spuštění ve čtyřech krocích."
        />
        <StepList steps={processSteps} className="mt-14" />
      </Container>
    </section>
  )
}
```

`components/home/team-card.tsx`:

```tsx
import Image from 'next/image'
import type { TeamMember } from '@/content/types'
import { cn } from '@/lib/cn'

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}

const CARD = 'flex h-full flex-col rounded-3xl border border-line bg-surface p-8'

export function TeamCard({ member }: { member: TeamMember }) {
  const body = (
    <>
      {member.photo ? (
        <Image
          src={member.photo}
          alt=""
          width={80}
          height={80}
          className="size-20 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-20 items-center justify-center rounded-full border border-line-strong bg-bg-soft font-display text-2xl font-semibold text-accent"
        >
          {getInitials(member.name)}
        </span>
      )}
      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{member.name}</h3>
      <p className="mt-1 text-sm text-accent">{member.role}</p>
      <p className="mt-4 text-fg-dim">{member.bio}</p>
      {member.website && (
        <span className="mt-auto pt-6 text-sm text-fg-dim">
          Osobní web <span aria-hidden="true">↗</span>
          <span className="sr-only"> (otevře se v novém okně)</span>
        </span>
      )}
    </>
  )

  if (member.website) {
    return (
      <a
        href={member.website}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(CARD, 'transition-colors hover:border-line-strong hover:bg-white/5')}
      >
        {body}
      </a>
    )
  }

  return <div className={CARD}>{body}</div>
}
```

`components/home/team.tsx`:

```tsx
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { team } from '@/content/team'
import { TeamCard } from './team-card'

export function Team() {
  return (
    <section id="o-nas" aria-labelledby="o-nas-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="o-nas-nadpis"
          eyebrow="O nás"
          title="Tři kluci, kteří tvoří weby, 3D a AI."
          lead="Malý tým znamená, že mluvíte přímo s námi — bez prostředníků a přeposílání."
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {team.map((member, index) => (
            <li key={member.slug}>
              <Reveal delay={index * 100} className="h-full">
                <TeamCard member={member} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
```

- [ ] **Step 5: Doplň sekcie do stránky**

`app/page.tsx`:

```tsx
import { AriaTeaser } from '@/components/home/aria-teaser'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Projects } from '@/components/home/projects'
import { Services } from '@/components/home/services'
import { Team } from '@/components/home/team'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <AriaTeaser />
      <Projects />
      <Process />
      <Team />
    </>
  )
}
```

- [ ] **Step 6: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/home app/page.tsx
git commit -F - <<'MSG'
feat: add projects, process and team sections

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 10: Kontakt a formulár

**Files:**
- Create: `components/contact/inquiry-form.tsx`, `components/contact/contact-section.tsx`
- Modify: `app/page.tsx`
- Test: `components/contact/inquiry-form.test.tsx`

**Interfaces:**
- Consumes: `sendInquiry` (Task 5); `INITIAL_INQUIRY_STATE`, `INQUIRY_SERVICES`, `INQUIRY_SERVICE_LABELS`, `parseServiceParam`, `InquiryField`, `InquiryService` (Task 4); `site` (Task 2); `Container`, `Reveal`, `cn` (Task 6).
- Produces: `<InquiryForm presetService?>`, `<InquiryFormWithParams />` (číta `?sluzba=` cez `useSearchParams`), `<ContactSection />` (`#kontakt`).

- [ ] **Step 1: Napíš padajúce testy**

`components/contact/inquiry-form.test.tsx`:

```tsx
// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const { sendInquiryMock, searchParamsMock } = vi.hoisted(() => ({
  sendInquiryMock: vi.fn(),
  searchParamsMock: vi.fn(() => new URLSearchParams()),
}))

vi.mock('@/app/actions/send-inquiry', () => ({ sendInquiry: sendInquiryMock }))
vi.mock('next/navigation', () => ({ useSearchParams: searchParamsMock }))

import { InquiryForm, InquiryFormWithParams } from '@/components/contact/inquiry-form'

const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement
const select = () => screen.getByLabelText(/O co máte zájem/) as HTMLSelectElement

function fillValid() {
  fireEvent.change(input('Jméno'), { target: { value: 'Jana Nováková' } })
  fireEvent.change(input('E-mail'), { target: { value: 'jana@example.cz' } })
  fireEvent.change(input('Váš projekt'), { target: { value: 'Potřebujeme nový web pro kavárnu.' } })
}

const submit = () => fireEvent.submit(screen.getByRole('form', { name: 'Poptávkový formulář' }))

describe('InquiryForm', () => {
  it('sends the filled-in fields to the server action', async () => {
    sendInquiryMock.mockResolvedValue({ status: 'success' })
    render(<InquiryForm />)
    fillValid()
    fireEvent.change(select(), { target: { value: 'ai' } })
    submit()

    expect(await screen.findByText('Díky, zpráva dorazila.')).toBeTruthy()
    const formData = sendInquiryMock.mock.calls[0][1] as FormData
    expect(Object.fromEntries(formData)).toEqual({
      name: 'Jana Nováková',
      email: 'jana@example.cz',
      service: 'ai',
      message: 'Potřebujeme nový web pro kavárnu.',
      website: '',
    })
    expect(screen.queryByRole('form', { name: 'Poptávkový formulář' })).toBeNull()
  })

  it('shows field errors and keeps everything the visitor typed', async () => {
    sendInquiryMock.mockResolvedValue({
      status: 'invalid',
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
    render(<InquiryForm />)
    fillValid()
    submit()

    expect(await screen.findByText('Zadejte platný e-mail.')).toBeTruthy()
    expect(input('E-mail').getAttribute('aria-invalid')).toBe('true')
    expect(input('Jméno').value).toBe('Jana Nováková')
    expect(input('Váš projekt').value).toBe('Potřebujeme nový web pro kavárnu.')
  })

  it('offers the e-mail address and a copy button when sending fails', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    sendInquiryMock.mockResolvedValue({ status: 'error' })
    render(<InquiryForm />)
    fillValid()
    submit()

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('Odeslání se nepovedlo.')
    expect(screen.getByRole('link', { name: 'info.indiweb@gmail.com' }).getAttribute('href')).toBe(
      'mailto:info.indiweb@gmail.com',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Zkopírovat zprávu' }))
    expect(await screen.findByRole('button', { name: 'Zpráva zkopírována' })).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith('Potřebujeme nový web pro kavárnu.')
  })

  it('preselects a service and lets the visitor change it', () => {
    render(<InquiryForm presetService="ai" />)
    expect(select().value).toBe('ai')
    fireEvent.change(select(), { target: { value: 'web' } })
    expect(select().value).toBe('web')
  })

  it('hides the honeypot from keyboard users', () => {
    const { container } = render(<InquiryForm />)
    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement
    expect(honeypot.tabIndex).toBe(-1)
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})

describe('InquiryFormWithParams', () => {
  it('preselects the service from ?sluzba=', () => {
    searchParamsMock.mockReturnValue(new URLSearchParams('sluzba=ai'))
    render(<InquiryFormWithParams />)
    expect(select().value).toBe('ai')
  })

  it('ignores an unknown ?sluzba= value', () => {
    searchParamsMock.mockReturnValue(new URLSearchParams('sluzba=eshop'))
    render(<InquiryFormWithParams />)
    expect(select().value).toBe('')
  })
})
```

- [ ] **Step 2: Over, že test padá**

Run: `npx vitest run components/contact`
Expected: FAIL — `Failed to resolve import "@/components/contact/inquiry-form"`.

- [ ] **Step 3: Formulár**

`components/contact/inquiry-form.tsx`:

```tsx
'use client'

import { useSearchParams } from 'next/navigation'
import {
  startTransition,
  useActionState,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { sendInquiry } from '@/app/actions/send-inquiry'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'
import {
  INITIAL_INQUIRY_STATE,
  INQUIRY_SERVICE_LABELS,
  INQUIRY_SERVICES,
  parseServiceParam,
  type InquiryField,
  type InquiryService,
} from '@/lib/inquiry-options'

const CONTROL =
  'w-full rounded-xl border bg-bg/60 px-4 py-3 text-fg transition-colors placeholder:text-fg-faint focus:border-accent focus:outline-hidden'

type FieldProps = {
  id: InquiryField
  label: string
  optional?: boolean
  error?: string
  children: ReactNode
}

function Field({ id, label, optional, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm text-fg-dim">
        {label}
        {optional && <span className="text-fg-faint"> (nepovinné)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-chyba`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function InquiryFormWithParams() {
  const searchParams = useSearchParams()
  return <InquiryForm presetService={parseServiceParam(searchParams.get('sluzba'))} />
}

export function InquiryForm({ presetService }: { presetService?: InquiryService }) {
  const [state, formAction, pending] = useActionState(sendInquiry, INITIAL_INQUIRY_STATE)
  const [chosenService, setChosenService] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const service = chosenService ?? presetService ?? ''
  const errors = state.status === 'invalid' ? state.fieldErrors : {}
  const errorOf = (field: InquiryField) => errors[field]?.[0]
  const controlProps = (field: InquiryField) => ({
    'aria-invalid': Boolean(errorOf(field)),
    'aria-describedby': errorOf(field) ? `${field}-chyba` : undefined,
    className: cn(CONTROL, errorOf(field) ? 'border-danger' : 'border-line'),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // A native form action would reset every field when the action returns,
    // even on a validation error. Dispatching manually keeps what was typed.
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setCopied(false)
    startTransition(() => formAction(formData))
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(messageRef.current?.value ?? '')
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-success/30 bg-success/10 p-6">
        <p className="font-display text-xl font-semibold">Díky, zpráva dorazila.</p>
        <p className="mt-2 text-fg-dim">Ozveme se vám do 24 hodin na e-mail, který jste uvedli.</p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      aria-label="Poptávkový formulář"
      className="relative grid gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Jméno" error={errorOf('name')}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            {...controlProps('name')}
          />
        </Field>
        <Field id="email" label="E-mail" error={errorOf('email')}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            {...controlProps('email')}
          />
        </Field>
      </div>

      <Field id="service" label="O co máte zájem" optional error={errorOf('service')}>
        <select
          id="service"
          name="service"
          value={service}
          onChange={(event) => setChosenService(event.target.value)}
          {...controlProps('service')}
        >
          <option value="">Vyberte službu</option>
          {INQUIRY_SERVICES.map((id) => (
            <option key={id} value={id}>
              {INQUIRY_SERVICE_LABELS[id]}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Váš projekt" error={errorOf('message')}>
        <textarea
          ref={messageRef}
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          {...controlProps('message')}
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Web (nevyplňujte)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg transition-colors hover:bg-accent-strong disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Odesílám…' : 'Odeslat poptávku'}
        </button>
      </div>

      <div aria-live="polite">
        {state.status === 'error' && (
          <div role="alert" className="rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm">
            <p className="font-medium text-fg">Odeslání se nepovedlo.</p>
            <p className="mt-1 text-fg-dim">
              Zkuste to prosím znovu, nebo nám napište přímo na{' '}
              <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={copyMessage}
              className="mt-3 rounded-full border border-line-strong px-4 py-2 text-fg transition-colors hover:bg-surface"
            >
              {copied ? 'Zpráva zkopírována' : 'Zkopírovat zprávu'}
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
```

- [ ] **Step 4: Sekcia Kontakt**

`components/contact/contact-section.tsx` (`useSearchParams` na statickej stránke musí byť vo vnútri `<Suspense>`, inak build zlyhá; fallback je rovnaký formulár bez predvoľby):

```tsx
import { Suspense } from 'react'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { site } from '@/content/site'
import { InquiryForm, InquiryFormWithParams } from './inquiry-form'

export function ContactSection() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-nadpis" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-surface p-8 sm:p-14">
            <h2
              id="kontakt-nadpis"
              className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Pojďme do toho.
            </h2>
            <p className="mt-4 text-lg text-fg-dim">
              Napište nám pár vět o svém projektu. Ozveme se do 24 hodin s prvními nápady —
              nezávazně.
            </p>
            <div className="mt-10">
              <Suspense fallback={<InquiryForm />}>
                <InquiryFormWithParams />
              </Suspense>
            </div>
            <p className="mt-8 text-sm text-fg-faint">
              Raději e-mailem? Pište na{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-fg-dim underline underline-offset-4 hover:text-fg"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
```

- [ ] **Step 5: Doplň kontakt do stránky**

`app/page.tsx`:

```tsx
import { ContactSection } from '@/components/contact/contact-section'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Projects } from '@/components/home/projects'
import { Services } from '@/components/home/services'
import { Team } from '@/components/home/team'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <AriaTeaser />
      <Projects />
      <Process />
      <Team />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 6: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS; build nesmie hlásiť `missing-suspense-with-csr-bailout` a route `/` musí ostať statická (`○`).

- [ ] **Step 7: Commit**

```bash
git add components/contact app/page.tsx
git commit -F - <<'MSG'
feat: add contact section with a working inquiry form

The form dispatches through startTransition so React does not clear the
fields when validation fails; on send errors it offers the e-mail address
and a copy-to-clipboard fallback.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 11: Podstránka `/aria`

**Files:**
- Create: `components/aria/aria-page.tsx`, `app/aria/page.tsx`
- Test: `components/aria/aria-page.test.tsx`

**Interfaces:**
- Consumes: `aria`, `media` (Task 2); `ButtonLink`, `Container`, `SectionHeading`, `Reveal`, `StepList` (Task 6).
- Produces: `<AriaPage />`; route `/aria` s `metadata.title = 'Aria — AI hlasový agent'`.

- [ ] **Step 1: Napíš padajúci test**

`components/aria/aria-page.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'

it('introduces Aria with its tagline', () => {
  render(<AriaPage />)
  expect(screen.getByRole('heading', { level: 1, name: 'Aria' })).toBeTruthy()
  expect(screen.getByText(aria.tagline)).toBeTruthy()
})

it('lists capabilities, audience and the rollout steps', () => {
  render(<AriaPage />)
  for (const text of [...aria.capabilities, ...aria.audience]) expect(screen.getByText(text)).toBeTruthy()
  for (const step of aria.rollout) {
    expect(screen.getByRole('heading', { level: 3, name: step.title })).toBeTruthy()
  }
})

it('links to the live demo and to the inquiry form with AI preselected', () => {
  render(<AriaPage />)
  const demo = screen.getByRole('link', { name: /Vyzkoušet Ariu/ })
  expect(demo.getAttribute('href')).toBe(aria.url)
  expect(demo.getAttribute('target')).toBe('_blank')
  const ctas = screen.getAllByRole('link', { name: 'Chci Ariu pro svou firmu' })
  expect(ctas.length).toBeGreaterThan(0)
  for (const cta of ctas) expect(cta.getAttribute('href')).toBe('/?sluzba=ai#kontakt')
})
```

- [ ] **Step 2: Over, že test padá**

Run: `npx vitest run components/aria`
Expected: FAIL — chýbajúci modul.

- [ ] **Step 3: Implementácia**

`components/aria/aria-page.tsx`:

```tsx
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { aria } from '@/content/aria'
import { media } from '@/content/site'

const INQUIRY_HREF = '/?sluzba=ai#kontakt'

export function AriaPage() {
  return (
    <>
      <section aria-labelledby="aria-nadpis">
        <Container className="grid min-h-svh items-center gap-12 pt-32 pb-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs tracking-[0.2em] text-accent uppercase">Náš vlastní produkt</p>
            <h1
              id="aria-nadpis"
              className="mt-4 font-display text-6xl font-semibold tracking-tight sm:text-8xl"
            >
              {aria.name}
            </h1>
            <p className="mt-6 font-display text-2xl text-balance sm:text-3xl">{aria.tagline}</p>
            <p className="mt-6 max-w-xl text-lg text-fg-dim">{aria.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={INQUIRY_HREF} withArrow>
                Chci Ariu pro svou firmu
              </ButtonLink>
              <ButtonLink href={aria.url} external variant="ghost" withArrow>
                Vyzkoušet Ariu
              </ButtonLink>
            </div>
          </div>
          <Image
            src={media.phone.src}
            alt={media.phone.alt}
            width={media.phone.width}
            height={media.phone.height}
            sizes="(min-width: 1024px) 35vw, 80vw"
            loading="eager"
            fetchPriority="high"
            className="mx-auto h-auto w-full max-w-sm"
          />
        </Container>
      </section>

      <section aria-labelledby="aria-umi" className="py-24">
        <Container>
          <SectionHeading id="aria-umi" eyebrow="Co Aria zvládne" title="Telefon, který nikdy nezvoní naprázdno." />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {aria.capabilities.map((capability, index) => (
              <li key={capability}>
                <Reveal delay={index * 80} className="h-full">
                  <p className="h-full rounded-3xl border border-line bg-surface p-7 text-lg">{capability}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-pro-koho" className="py-24">
        <Container>
          <SectionHeading id="aria-pro-koho" eyebrow="Pro koho je" title="Pro všechny, kdo nestíhají zvedat telefon." />
          <ul className="mt-12 flex flex-wrap gap-3">
            {aria.audience.map((item) => (
              <li key={item} className="rounded-full border border-line-strong px-5 py-2.5 text-fg-dim">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-nasazeni" className="py-24">
        <Container>
          <SectionHeading id="aria-nasazeni" eyebrow="Nasazení" title="Jak Ariu spustíme u vás." />
          <StepList steps={aria.rollout} className="mt-12" />
        </Container>
      </section>

      <section aria-labelledby="aria-cta" className="py-24">
        <Container>
          <Reveal>
            <div className="rounded-[2rem] border border-accent/30 bg-linear-to-br from-accent/15 via-bg-soft to-bg p-10 text-center sm:p-16">
              <h2 id="aria-cta" className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Chcete Ariu i u vás?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-fg-dim">
                Napište nám, jaké hovory vám chodí. Ozveme se do 24 hodin.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href={INQUIRY_HREF} withArrow>
                  Chci Ariu pro svou firmu
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
```

`app/aria/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'

export const metadata: Metadata = {
  title: 'Aria — AI hlasový agent',
  description: aria.description,
}

export default function Page() {
  return <AriaPage />
}
```

- [ ] **Step 4: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS; build vypíše statickú route `/aria`.

- [ ] **Step 5: Commit**

```bash
git add components/aria app/aria
git commit -F - <<'MSG'
feat: add the Aria product page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 12: Case study `/projekty/[slug]`

**Files:**
- Create: `components/project/project-detail.tsx`, `app/projekty/[slug]/page.tsx`
- Test: `components/project/project-detail.test.tsx`

**Interfaces:**
- Consumes: `projects`, `PROJECT_IMAGE_SIZE` (Task 2); `getProject`, `getNextProject`, `MARKET_LABELS` (Task 2); `BrowserFrame`, `ButtonLink`, `Container`, `BulletList`, `TagList` (Task 6).
- Produces: `<ProjectDetail project next?>`; statické routes `/projekty/elevator-servis`, `/projekty/esencia-viva`; neznámy slug → 404.

- [ ] **Step 1: Napíš padajúci test**

`components/project/project-detail.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ProjectDetail } from '@/components/project/project-detail'
import { projects } from '@/content/projects'

const [project, next] = projects

it('describes the project', () => {
  render(<ProjectDetail project={project} next={next} />)
  expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeTruthy()
  expect(screen.getByText(`${project.client} · Slovensko`)).toBeTruthy()
  expect(screen.getByText(project.description)).toBeTruthy()
  for (const highlight of project.highlights) expect(screen.getByText(highlight)).toBeTruthy()
})

it('links to the live site, the inquiry form and the next project', () => {
  render(<ProjectDetail project={project} next={next} />)
  const live = screen.getByRole('link', { name: /Otevřít web/ })
  expect(live.getAttribute('href')).toBe(project.liveUrl)
  expect(live.getAttribute('target')).toBe('_blank')
  expect(screen.getByRole('link', { name: 'Chci podobný web' }).getAttribute('href')).toBe('/#kontakt')
  expect(screen.getByRole('link', { name: `${next.title} →` }).getAttribute('href')).toBe(
    `/projekty/${next.slug}`,
  )
})

it('omits the next-project link when there is none', () => {
  render(<ProjectDetail project={project} />)
  expect(screen.queryByRole('navigation', { name: 'Další projekt' })).toBeNull()
})
```

- [ ] **Step 2: Over, že test padá**

Run: `npx vitest run components/project`
Expected: FAIL — chýbajúci modul.

- [ ] **Step 3: Implementácia**

`components/project/project-detail.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { TagList } from '@/components/ui/tag-list'
import { PROJECT_IMAGE_SIZE } from '@/content/projects'
import type { Project } from '@/content/types'
import { MARKET_LABELS } from '@/lib/projects'

export function ProjectDetail({ project, next }: { project: Project; next?: Project }) {
  const host = new URL(project.liveUrl).host

  return (
    <article className="pt-32 pb-24">
      <Container>
        <Link href="/#projekty" className="text-sm text-fg-dim transition-colors hover:text-fg">
          ← Všechny projekty
        </Link>
        <p className="mt-10 text-xs tracking-[0.18em] text-fg-faint uppercase">
          {project.client} · {MARKET_LABELS[project.market]}
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-dim">{project.summary}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={project.liveUrl} external withArrow>
            Otevřít web
          </ButtonLink>
          <ButtonLink href="/#kontakt" variant="ghost">
            Chci podobný web
          </ButtonLink>
        </div>

        <BrowserFrame url={host} className="mt-14">
          <Image
            src={project.image}
            alt={`Úvodní obrazovka webu ${project.title}`}
            width={PROJECT_IMAGE_SIZE.width}
            height={PROJECT_IMAGE_SIZE.height}
            sizes="(min-width: 1152px) 1152px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full"
          />
        </BrowserFrame>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <section aria-labelledby="o-projektu">
            <h2 id="o-projektu" className="font-display text-2xl font-semibold">
              O projektu
            </h2>
            <p className="mt-4 leading-relaxed text-fg-dim">{project.description}</p>
          </section>
          <section aria-labelledby="co-web-umi">
            <h2 id="co-web-umi" className="font-display text-2xl font-semibold">
              Co web umí
            </h2>
            <BulletList items={project.highlights} className="mt-4 text-fg-dim" />
            <TagList tags={project.tags} className="mt-6" />
          </section>
        </div>

        {next && (
          <nav aria-label="Další projekt" className="mt-20 border-t border-line pt-10">
            <p className="text-sm text-fg-faint">Další projekt</p>
            <Link
              href={`/projekty/${next.slug}`}
              className="mt-2 inline-block font-display text-3xl font-semibold transition-colors hover:text-accent"
            >
              {next.title} →
            </Link>
          </nav>
        )}
      </Container>
    </article>
  )
}
```

`app/projekty/[slug]/page.tsx` (`params` je v Next 16 Promise; explicitný typ namiesto globálneho `PageProps`, ktorý existuje až po typegen):

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/project/project-detail'
import { projects } from '@/content/projects'
import { getNextProject, getProject } from '@/lib/projects'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return { title: project.title, description: project.summary }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <ProjectDetail project={project} next={getNextProject(slug)} />
}
```

- [ ] **Step 4: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS; build vypíše `● /projekty/[slug]` s `/projekty/elevator-servis` a `/projekty/esencia-viva`.

- [ ] **Step 5: Commit**

```bash
git add components/project "app/projekty"
git commit -F - <<'MSG'
feat: add statically generated project case studies

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 13: SEO — sitemap, robots, náhľad pri zdieľaní

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`
- Test: `app/seo.test.ts`

**Interfaces:**
- Consumes: `site`, `projects` (Task 2).
- Produces: `/sitemap.xml`, `/robots.txt`, `/opengraph-image` (predvolený náhľad pre všetky stránky).

- [ ] **Step 1: Napíš padajúci test**

`app/seo.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { projects } from '@/content/projects'
import { site } from '@/content/site'

describe('sitemap', () => {
  it('lists the home page, Aria and every project', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      site.url,
      `${site.url}/aria`,
      ...projects.map((project) => `${site.url}/projekty/${project.slug}`),
    ])
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
```

- [ ] **Step 2: Over, že test padá**

Run: `npx vitest run app/seo.test.ts`
Expected: FAIL — chýbajúce moduly.

- [ ] **Step 3: Implementácia**

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { site } from '@/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: site.url, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/aria`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((project) => ({
      url: `${site.url}/projekty/${project.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
```

`app/opengraph-image.tsx` (text **bez diakritiky** — predvolené písmo `ImageResponse` nemusí mať české znaky; žiadny `display: grid`):

```tsx
import { ImageResponse } from 'next/og'

export const alt = 'IndiWeb — weby, 3D a AI agenti'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#08080a',
          backgroundImage: 'radial-gradient(60% 60% at 50% 0%, rgba(120,130,255,0.35), transparent 70%)',
          color: '#f4f4f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: 40, fontWeight: 600 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: '#ffffff' }} />
          IndiWeb
        </div>
        <div style={{ marginTop: 40, fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          Weby, 3D a AI agenti
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: '#a0a0aa' }}>Denis, Adam a Ondra</div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 4: Testy, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: PASS; build vypíše `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/opengraph-image.tsx app/seo.test.ts
git commit -F - <<'MSG'
feat: add sitemap, robots and a default share image

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 14: Overenie, README a odovzdanie

**Files:**
- Modify (replace): `README.md`
- Modify: `docs/superpowers/specs/2026-09-23-indiweb-rebuild-design.md` (stav)

- [ ] **Step 1: Kompletná kontrola**

Run: `npm run lint && npm test && npm run build`
Expected: lint bez chýb, všetky testy PASS, build vypíše statické routes `/`, `/aria`, `/_not-found`, `/projekty/elevator-servis`, `/projekty/esencia-viva`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.

- [ ] **Step 2: Manuálna kontrola v prehliadači (vykonáva hlavný agent, nie subagent)**

Spusti produkčný server (`npm run start`, port 3000) cez zabudovaný prehliadač a skontroluj na šírke 1440 px aj 375 px:

1. Úvod: hero, rotujúce slovo, všetky sekcie v poradí Služby → Aria → Projekty → Postup → O nás → Kontakt; žiadny horizontálny scroll na 375 px.
2. Menu: odkazy scrollujú na sekcie a header ich neprekrýva; mobilné menu sa otvorí, zavrie klikom na odkaz aj Escape.
3. Projekty: karta vedie na `/projekty/<slug>`, „Živá ukázka" otvorí web v novej karte; podstránka má „Další projekt".
4. `/aria`: „Chci Ariu pro svou firmu" vedie na `/?sluzba=ai#kontakt` a vo formulári je predvolené „AI agent".
5. `/projekty/neexistuje` → vlastná 404.
6. Formulár lokálne **bez** `RESEND_API_KEY`: odoslanie ukáže „Odeslání se nepovedlo." + e-mail + „Zkopírovat zprávu"; vyplnené polia ostanú.
7. Konzola prehliadača bez chýb.

Nájdené chyby oprav (s testom), znovu spusti Step 1 a commitni ako `fix: …`.

- [ ] **Step 3: README**

Nahraď `README.md`:

````markdown
# IndiWeb

Web IndiWebu — Denis, Adam a Ondra. Next.js 16, Tailwind CSS 4, nasadenie na Verceli.

## Vývoj

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest
npm run lint
npm run build
```

## Kde sa čo upravuje

| Čo | Súbor |
|---|---|
| Texty úvodu, navigácia, e-mail, fotky | `content/site.ts` |
| Služby | `content/services.ts` |
| Projekty v portfóliu | `content/projects.ts` |
| Tím (role, bio, osobné weby, fotky) | `content/team.ts` |
| Aria (texty, URL) | `content/aria.ts` |
| Postup spolupráce | `content/process.ts` |
| Farby a písma | `app/globals.css` |

## Nový projekt do portfólia

1. Pridaj blok do `content/projects.ts` (`slug`, texty, `liveUrl`, `image: '/projects/<slug>.webp'`).
2. Vygeneruj screenshot (používa Microsoft Edge vo Windows):
   ```bash
   node scripts/capture-screenshots.mjs <slug>=<url>
   ```
3. `npm test` overí, že screenshot existuje a má správny rozmer. Podstránka `/projekty/<slug>` sa vytvorí sama.

## Formulár

Dopyty chodia cez [Resend](https://resend.com) na `info.indiweb@gmail.com`.

- Resend účet musí byť založený na `info.indiweb@gmail.com` — testovací odosielateľ `onboarding@resend.dev` doručuje iba majiteľovi účtu.
- API kľúč nastav vo Verceli ako `RESEND_API_KEY` (Production aj Preview). Lokálne do `.env.local` (vzor: `.env.example`).
- Bez kľúča web funguje, formulár pri odoslaní ukáže záložný e-mail.
- Po kúpe domény: overiť ju v Resende a zmeniť odosielateľa v `lib/inquiry-email.ts`.

## Nasadenie

Každý push do `main` nasadí Vercel automaticky (`vercel.json` nastavuje framework Next.js). Iné vetvy dostanú preview URL.
Voliteľne `NEXT_PUBLIC_SITE_URL` — kanonická adresa webu; inak sa použije produkčná doména z Vercelu.
````

- [ ] **Step 4: Stav v specu a commit**

V `docs/superpowers/specs/2026-09-23-indiweb-rebuild-design.md` zmeň riadok `**Stav:**` na `**Stav:** implementované na vetve feat/rebuild`.

```bash
git add README.md docs/superpowers/specs/2026-09-23-indiweb-rebuild-design.md
git commit -F - <<'MSG'
docs: document content editing, portfolio updates and deployment

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

- [ ] **Step 5: Odovzdanie používateľovi — STOP, čakaj na súhlas**

Neposielaj nič na GitHub bez výslovného súhlasu. Povedz používateľovi:

1. Aby založil Resend účet na `info.indiweb@gmail.com`, vytvoril API kľúč a vložil ho do Vercelu (*Settings → Environment Variables*, `RESEND_API_KEY`, Production + Preview).
2. Navrhni `git push -u origin feat/rebuild` → Vercel vytvorí **preview** URL (produkcia sa nezmení). Po súhlase pushni, over preview v prehliadači a pošli skúšobný dopyt — musí prísť na `info.indiweb@gmail.com`.
3. Až po odsúhlasení preview navrhni zlúčenie do `main` (produkcia `indiweb-kappa.vercel.app`).
