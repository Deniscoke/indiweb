import { describe, expect, it } from 'vitest'
import { fabListings } from '@/content/fab'
import { getDictionary } from '@/content/locales'
import { cs } from '@/content/locales/cs'
import { getPrivacy, type PrivacySection } from '@/content/locales/privacy'
import { projects } from '@/content/projects'
import { NAV_SECTIONS } from '@/content/site'
import { team } from '@/content/team'
import { SERVICE_IDS } from '@/content/types'
import { LOCALES } from '@/lib/i18n'
import { INQUIRY_SERVICES } from '@/lib/inquiry-options'
import { VOICES } from '@/lib/voice-agent'

/** The shape of a value: keys and array lengths, with every text reduced to "text". */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, shape(item)]),
    )
  }
  return typeof value === 'string' ? 'text' : typeof value
}

/** Every `{placeholder}` in a dictionary, by the path of the text that has it. */
function placeholders(value: unknown, path = ''): Record<string, string[]> {
  if (typeof value === 'string') {
    const found = value.match(/\{\w+\}/g)
    return found ? { [path]: [...found].sort() } : {}
  }
  if (!value || typeof value !== 'object') return {}
  return Object.assign({}, ...Object.entries(value).map(([key, item]) => placeholders(item, `${path}.${key}`)))
}

const keys = (value: object) => Object.keys(value).sort()
const sorted = (values: readonly string[]) => [...values].sort()

describe('getDictionary', () => {
  it('returns the Czech dictionary for Czech', () => {
    expect(getDictionary('cs')).toBe(cs)
    expect(getDictionary('cs').site.title).toBe('IndiWeb — weby na míru, 3D a AI agenti')
  })

  it.each(LOCALES)('has a dictionary for %s', (locale) => {
    expect(getDictionary(locale).site.title).toBeTruthy()
  })

  it('is plain data, so it can be handed to client components', () => {
    for (const locale of LOCALES) {
      expect(JSON.parse(JSON.stringify(getDictionary(locale)))).toEqual(getDictionary(locale))
    }
  })

  it('shows no language note under the Czech voice demo', () => {
    expect(cs.voiceDemo.languageNote).toBe('')
  })
})

describe.each(LOCALES)('the %s dictionary', (locale) => {
  const dict = getDictionary(locale)

  it('has the same keys and the same list lengths as the Czech one', () => {
    // Plural forms differ by language (Czech has "few"), so they are compared apart.
    const comparable = (d: typeof cs) => shape({ ...d, fab: { ...d.fab, productsOnFab: null } })
    expect(comparable(dict)).toEqual(comparable(cs))
  })

  it('fills the same placeholders as the Czech one', () => {
    const comparable = (d: typeof cs) => placeholders({ ...d, fab: { ...d.fab, productsOnFab: null } })
    expect(comparable(dict)).toEqual(comparable(cs))
  })

  it('counts products with at least "one" and "other", each showing the number', () => {
    const forms = dict.fab.productsOnFab
    expect(forms.one).toContain('{count}')
    expect(forms.other).toContain('{count}')
    for (const form of Object.values(forms)) expect(form).toContain('{count}')
  })

  it('names every section of the menu', () => {
    expect(keys(dict.nav)).toEqual(sorted(NAV_SECTIONS))
  })

  it('describes every service, with as many points as in Czech', () => {
    expect(keys(dict.services.items)).toEqual(sorted(SERVICE_IDS))
    for (const id of SERVICE_IDS) {
      expect(dict.services.items[id].points).toHaveLength(cs.services.items[id].points.length)
    }
  })

  it('describes every project', () => {
    expect(keys(dict.projects.items)).toEqual(sorted(projects.map((project) => project.slug)))
    for (const { slug } of projects) {
      expect(dict.projects.items[slug].highlights).toHaveLength(cs.projects.items[slug].highlights.length)
      expect(dict.projects.items[slug].tags).toHaveLength(cs.projects.items[slug].tags.length)
      expect(dict.projects.items[slug].summary.length).toBeLessThanOrEqual(140)
    }
  })

  it('introduces every team member and says what every Fab listing is', () => {
    expect(keys(dict.team.members)).toEqual(sorted(team.map((member) => member.slug)))
    expect(keys(dict.fab.kinds)).toEqual(sorted(fabListings.map((listing) => listing.slug)))
  })

  it('labels every inquiry option and describes every voice', () => {
    expect(keys(dict.contact.form.services)).toEqual(sorted(INQUIRY_SERVICES))
    expect(keys(dict.voiceDemo.voices)).toEqual(sorted(VOICES.map((voice) => voice.slug)))
  })

  it('keeps the lists the layout is built around', () => {
    expect(dict.hero.lines).toHaveLength(3)
    expect(dict.process.steps).toHaveLength(4)
    expect(dict.aria.rollout).toHaveLength(4)
    expect(dict.aria.capabilities).toHaveLength(cs.aria.capabilities.length)
    expect(dict.aria.audience).toHaveLength(cs.aria.audience.length)
    expect(dict.fab.facts).toHaveLength(cs.fab.facts.length)
    expect(dict.splat.collaboration).toHaveLength(cs.splat.collaboration.length)
  })

  it('has a privacy notice with the same sections and blocks as the Czech one', () => {
    const blocks = (notice: ReturnType<typeof getPrivacy>) =>
      notice.sections.map((section: PrivacySection) =>
        section.body.map((block) => ('list' in block ? `list:${block.list.length}` : Object.keys(block)[0])),
      )
    expect(blocks(getPrivacy(locale))).toEqual(blocks(getPrivacy('cs')))
    expect(shape({ ...getPrivacy(locale), sections: null })).toEqual(shape({ ...getPrivacy('cs'), sections: null }))
    expect(getPrivacy(locale).effective).toContain('{date}')
  })
})
