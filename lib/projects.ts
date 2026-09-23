import { projects } from '@/content/projects'
import type { Market, Project } from '@/content/types'

export const MARKET_LABELS: Record<Market, string> = { SK: 'Slovensko', CZ: 'Česko' }

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1 || projects.length < 2) return undefined
  return projects[(index + 1) % projects.length]
}
