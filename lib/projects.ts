import type { Dictionary } from '@/content/locales'
import { localizedProjects } from '@/content/projects'
import type { Project } from '@/content/types'

export function getProject(slug: string, dict: Dictionary): Project | undefined {
  return localizedProjects(dict).find((project) => project.slug === slug)
}

export function getNextProject(slug: string, dict: Dictionary): Project | undefined {
  const projects = localizedProjects(dict)
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1 || projects.length < 2) return undefined
  return projects[(index + 1) % projects.length]
}
