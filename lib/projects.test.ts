import { describe, expect, it } from 'vitest'
import { cs } from '@/content/locales/cs'
import { localizedProjects } from '@/content/projects'
import { getNextProject, getProject } from '@/lib/projects'

const projects = localizedProjects(cs)

describe('getProject', () => {
  it('finds a project by slug', () => {
    expect(getProject('elevator-servis', cs)).toEqual(projects[0])
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProject('neexistuje', cs)).toBeUndefined()
  })
})

describe('getNextProject', () => {
  it('returns the following project', () => {
    expect(getNextProject(projects[0].slug, cs)).toEqual(projects[1])
  })

  it('wraps around to the first project', () => {
    expect(getNextProject(projects[projects.length - 1].slug, cs)).toEqual(projects[0])
  })

  it('returns undefined for an unknown slug', () => {
    expect(getNextProject('neexistuje', cs)).toBeUndefined()
  })
})

describe('markets', () => {
  it('names both markets in Czech', () => {
    expect(cs.common.markets).toEqual({ SK: 'Slovensko', CZ: 'Česko' })
  })
})
