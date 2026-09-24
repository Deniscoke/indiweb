// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getInitials, TeamCard } from '@/components/home/team-card'
import type { TeamMember } from '@/content/types'

const denis: TeamMember = {
  slug: 'denis',
  name: 'Denis Mitrović',
  role: 'Spoluzakladatel',
  bio: 'Bio',
  website: 'https://mojweb2.vercel.app',
}

describe('TeamCard', () => {
  it('links to the personal website in a new tab', () => {
    render(<TeamCard member={denis} />)
    const link = screen.getByRole('link', { name: /Denis Mitrović/ })
    expect(link.getAttribute('href')).toBe('https://mojweb2.vercel.app')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(screen.getByText('DM')).toBeTruthy()
  })

  it('is a plain card without a website', () => {
    render(<TeamCard member={{ ...denis, website: undefined, name: 'Adam', slug: 'adam' }} />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByRole('heading', { level: 3, name: 'Adam' })).toBeTruthy()
  })
})

describe('getInitials', () => {
  it.each([
    ['Denis Mitrović', 'DM'],
    ['Adam', 'A'],
    ['  ondra  ', 'O'],
  ])('%s → %s', (name, initials) => {
    expect(getInitials(name)).toBe(initials)
  })
})
