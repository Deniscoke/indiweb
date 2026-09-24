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
