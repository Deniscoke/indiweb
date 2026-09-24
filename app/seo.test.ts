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
