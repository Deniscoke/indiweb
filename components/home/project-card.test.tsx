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
