// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ProjectDetail } from '@/components/project/project-detail'
import { projects } from '@/content/projects'

const [project, next] = projects

it('describes the project', () => {
  render(<ProjectDetail project={project} next={next} />)
  expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeTruthy()
  expect(screen.getByText(project.client)).toBeTruthy()
  expect(screen.getByText('Slovensko')).toBeTruthy()
  expect(screen.getByText(project.description)).toBeTruthy()
  for (const highlight of project.highlights) expect(screen.getByText(highlight)).toBeTruthy()
})

it('links to the live site, the inquiry form and the next project', () => {
  render(<ProjectDetail project={project} next={next} />)
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
  render(<ProjectDetail project={project} />)
  expect(screen.queryByRole('navigation', { name: 'Další projekt' })).toBeNull()
})
