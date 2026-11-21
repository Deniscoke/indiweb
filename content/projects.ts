import type { Dictionary } from './locales/cs'
import type { Project, ProjectData } from './types'

/** Every screenshot is a 1440×900 viewport capture (see scripts/capture-screenshots.mjs). */
export const PROJECT_IMAGE_SIZE = { width: 1440, height: 900 } as const

const PROJECTS = [
  {
    slug: 'elevator-servis',
    title: 'Elevátor Servis',
    market: 'SK',
    liveUrl: 'https://elevatorservis.sk',
    image: '/projects/elevator-servis.webp',
  },
  {
    slug: 'esencia-viva',
    title: 'Esencia Viva',
    market: 'CZ',
    liveUrl: 'https://esenciaviva.cz',
    image: '/projects/esencia-viva.webp',
  },
] as const satisfies readonly ProjectData[]

export type ProjectSlug = (typeof PROJECTS)[number]['slug']

// Typed by slug, so every dictionary must describe each project.
export const projects: readonly (ProjectData & { slug: ProjectSlug })[] = PROJECTS

/** The projects with their texts in one language. */
export function localizedProjects(dict: Dictionary): Project[] {
  return projects.map((project) => ({ ...project, ...dict.projects.items[project.slug] }))
}
