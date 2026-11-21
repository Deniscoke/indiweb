import { describe, expect, it } from 'vitest'
import { FAB_STORE_URL, fabImage, fabListings, localizedFabListings } from '@/content/fab'
import { cs } from '@/content/locales/cs'
import { localizedProjects } from '@/content/projects'
import { localizedServices } from '@/content/services'
import { NAV_SECTIONS, PRODUCTION_URL, resolveSiteUrl, site } from '@/content/site'
import { splatScene } from '@/content/splat'
import { localizedTeam, team } from '@/content/team'
import { SERVICE_IDS } from '@/content/types'
import { plural } from '@/lib/i18n'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const isHttps = (url: string) => new URL(url).protocol === 'https:'

const { aria, hero } = cs
const services = localizedServices(cs)
const projects = localizedProjects(cs)

describe('site', () => {
  it('uses the IndiWeb inbox', () => {
    expect(site.email).toBe('info.indiweb@gmail.com')
  })

  it('names every home page section of the menu, by its id', () => {
    for (const section of NAV_SECTIONS) {
      expect(section).toMatch(/^[a-z-]+$/)
      expect(cs.nav[section]).toBeTruthy()
    }
  })

  it('spreads three short lines across the hero', () => {
    expect(hero.lines).toHaveLength(3)
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

  it('joins each project with its Czech texts', () => {
    expect(projects[0]).toMatchObject({ title: 'Elevátor Servis', client: 'Servis výtahů, Banská Bystrica' })
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

  it('gives every member a role and a bio', () => {
    for (const m of localizedTeam(cs)) {
      expect(m.role).toBeTruthy()
      expect(m.bio).toBeTruthy()
    }
  })
})

describe('aria', () => {
  it('describes capabilities, audience and a four-step rollout', () => {
    expect(aria.capabilities.length).toBeGreaterThanOrEqual(3)
    expect(aria.audience.length).toBeGreaterThanOrEqual(3)
    expect(aria.rollout).toHaveLength(4)
  })
})

describe('process', () => {
  it('has four steps', () => {
    expect(cs.process.steps).toHaveLength(4)
  })
})

describe('splat showcase', () => {
  it('embeds a Splatoo presentation over https', () => {
    const embed = new URL(splatScene.embedUrl)
    expect(embed.protocol).toBe('https:')
    expect(embed.hostname).toBe('app.splatoo.com')
    expect(embed.searchParams.get('embed')).toBe('1')
    expect(isHttps(splatScene.url)).toBe(true)
  })

  it('names what we build together with Splatoo', () => {
    expect(cs.splat.collaboration.length).toBeGreaterThanOrEqual(3)
  })
})

describe('resolveSiteUrl', () => {
  it('uses the www domain in production, where indiweb.cz redirects to it', () => {
    expect(resolveSiteUrl({ VERCEL_ENV: 'production', VERCEL_URL: 'indiweb-abc.vercel.app' })).toBe(PRODUCTION_URL)
    expect(PRODUCTION_URL).toBe('https://www.indiweb.cz')
  })

  it('lets previews and local runs point to themselves, and allows an override', () => {
    expect(resolveSiteUrl({ VERCEL_ENV: 'preview', VERCEL_URL: 'indiweb-abc.vercel.app' })).toBe('https://indiweb-abc.vercel.app')
    expect(resolveSiteUrl({})).toBe('http://localhost:3000')
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://example.cz', VERCEL_ENV: 'production' })).toBe('https://example.cz')
  })
})

describe('fab store', () => {
  it('has unique url-safe slugs', () => {
    const slugs = fabListings.map((l) => l.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(SLUG)
  })

  it('links the store and every listing to fab.com', () => {
    for (const url of [FAB_STORE_URL, ...fabListings.map((l) => l.url)]) {
      expect(isHttps(url)).toBe(true)
      expect(new URL(url).host).toBe('www.fab.com')
    }
  })

  it('features a full row of four on desktop', () => {
    const featured = fabListings.filter((l) => l.featured)
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.length % 4).toBe(0)
  })

  it('stores each preview as /fab/<slug>.webp', () => {
    expect(fabImage('combat-vfx')).toBe('/fab/combat-vfx.webp')
  })

  it('says what every listing is', () => {
    for (const listing of localizedFabListings(cs)) expect(listing.kind).toBeTruthy()
  })

  it('counts products in Czech', () => {
    const count = (n: number) => plural('cs', n, cs.fab.productsOnFab)
    expect(count(1)).toBe('1 produkt na Fabu')
    expect(count(3)).toBe('3 produkty na Fabu')
    expect(count(15)).toBe('15 produktů na Fabu')
  })
})
