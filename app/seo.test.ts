import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { projects } from '@/content/projects'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { team } from '@/content/team'
import { DEFAULT_SHARE_IMAGE, organizationJsonLd, pageMetadata } from '@/lib/seo'

describe('sitemap', () => {
  it('lists the home page, Aria and every project', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      site.url,
      `${site.url}/aria`,
      `${site.url}/ochrana-osobnich-udaju`,
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

describe('pageMetadata', () => {
  it('gives a page its canonical address, a large share card and the default share image', () => {
    const meta = pageMetadata({ title: 'Aria', description: 'Popis', path: '/aria' })
    expect(meta.alternates?.canonical).toBe('/aria')
    expect(meta.openGraph).toMatchObject({ title: 'Aria', description: 'Popis', url: '/aria', images: [DEFAULT_SHARE_IMAGE] })
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', images: [DEFAULT_SHARE_IMAGE] })
  })

  it('uses a page’s own picture when it has one', () => {
    const meta = pageMetadata({ title: 'P', description: 'D', path: '/projekty/x', image: '/projects/x.webp' })
    expect(meta.openGraph).toMatchObject({ images: ['/projects/x.webp'] })
  })
})

describe('organizationJsonLd', () => {
  it('describes IndiWeb as a professional service with its founders and services', () => {
    const data = organizationJsonLd()
    expect(data['@type']).toBe('ProfessionalService')
    expect(data).toMatchObject({ name: site.name, url: site.url, email: site.email })
    expect(data.founder.map((person) => person.name)).toEqual(team.map((member) => member.name))
    for (const service of services) expect(data.knowsAbout).toContain(service.title)
  })
})
