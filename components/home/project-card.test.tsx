// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { ProjectCard } from '@/components/home/project-card'
import { cs } from '@/content/locales/cs'
import { en } from '@/content/locales/en'
import { localizedProjects } from '@/content/projects'

const project = localizedProjects(cs)[0]

it('links the title to the case study', () => {
  renderWithI18n(<ProjectCard project={project} />)
  expect(screen.getByRole('link', { name: project.title }).getAttribute('href')).toBe(
    `/projekty/${project.slug}`,
  )
})

it('opens the live site in a new tab', () => {
  renderWithI18n(<ProjectCard project={project} />)
  const live = screen.getByRole('link', { name: /Živá ukázka/ })
  expect(live.getAttribute('href')).toBe(project.liveUrl)
  expect(live.getAttribute('target')).toBe('_blank')
  expect(live.getAttribute('rel')).toBe('noopener noreferrer')
})

it('shows the screenshot, host, client and market', () => {
  renderWithI18n(<ProjectCard project={project} />)
  expect(screen.getByAltText(`Úvodní obrazovka webu ${project.title}`)).toBeTruthy()
  expect(screen.getByText('elevatorservis.sk')).toBeTruthy()
  expect(screen.getByText('Servis výtahů, Banská Bystrica')).toBeTruthy()
  expect(screen.getByText('Slovensko')).toBeTruthy()
})

it('shows the screenshot in black and white until hovered', () => {
  renderWithI18n(<ProjectCard project={project} />)
  expect(screen.getByAltText(`Úvodní obrazovka webu ${project.title}`).getAttribute('class')).toContain('grayscale')
})

it('links to the case study in the visitor’s language', () => {
  renderWithI18n(<ProjectCard project={localizedProjects(en)[0]} />, 'en')
  expect(screen.getByRole('link', { name: project.title }).getAttribute('href')).toBe(`/en/projects/${project.slug}`)
})
