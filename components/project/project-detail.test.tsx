// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { ProjectDetail } from '@/components/project/project-detail'
import { cs } from '@/content/locales/cs'
import { en } from '@/content/locales/en'
import { localizedProjects } from '@/content/projects'

const [project, next] = localizedProjects(cs)

it('describes the project', () => {
  renderWithI18n(<ProjectDetail locale="cs" project={project} next={next} />)
  expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeTruthy()
  expect(screen.getByText(project.client)).toBeTruthy()
  expect(screen.getByText('Slovensko')).toBeTruthy()
  expect(screen.getByText(project.description)).toBeTruthy()
  for (const highlight of project.highlights) expect(screen.getByText(highlight)).toBeTruthy()
})

it('links to the live site, the inquiry form and the next project', () => {
  renderWithI18n(<ProjectDetail locale="cs" project={project} next={next} />)
  const live = screen.getByRole('link', { name: /Otevřít web/ })
  expect(live.getAttribute('href')).toBe(project.liveUrl)
  expect(live.getAttribute('target')).toBe('_blank')
  const ctaLinks = screen.getAllByRole('link', { name: 'Chci podobný web' })
  expect(ctaLinks.length).toBeGreaterThan(0)
  for (const cta of ctaLinks) expect(cta.getAttribute('href')).toBe('/#kontakt')
  expect(screen.getByRole('link', { name: `${next.title} →` }).getAttribute('href')).toBe(
    `/projekty/${next.slug}`,
  )
})

it('omits the next-project link when there is none', () => {
  renderWithI18n(<ProjectDetail locale="cs" project={project} />)
  expect(screen.queryByRole('navigation', { name: 'Další projekt' })).toBeNull()
})

it('keeps German visitors on German addresses', () => {
  const [first, second] = localizedProjects(en)
  renderWithI18n(<ProjectDetail locale="de" project={first} next={second} />, 'de')
  const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
  expect(hrefs).toContain('/de#projekty')
  expect(hrefs).toContain('/de#kontakt')
  expect(hrefs).toContain(`/de/projekte/${second.slug}`)
})
