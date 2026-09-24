import { describe, expect, it } from 'vitest'
import { projects } from '@/content/projects'
import { getNextProject, getProject, MARKET_LABELS } from '@/lib/projects'

describe('getProject', () => {
  it('finds a project by slug', () => {
    expect(getProject('elevator-servis')?.title).toBe('Elevátor Servis')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProject('neexistuje')).toBeUndefined()
  })
})

describe('getNextProject', () => {
  it('returns the following project', () => {
    expect(getNextProject(projects[0].slug)).toBe(projects[1])
  })

  it('wraps around to the first project', () => {
    expect(getNextProject(projects[projects.length - 1].slug)).toBe(projects[0])
  })

  it('returns undefined for an unknown slug', () => {
    expect(getNextProject('neexistuje')).toBeUndefined()
  })
})

describe('MARKET_LABELS', () => {
  it('names both markets in Czech', () => {
    expect(MARKET_LABELS).toEqual({ SK: 'Slovensko', CZ: 'Česko' })
  })
})
