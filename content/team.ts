import type { Dictionary } from './locales/cs'
import type { TeamMember, TeamMemberData } from './types'

const TEAM = [
  { slug: 'denis', name: 'Denis Mitrović', website: 'https://mojweb2.vercel.app' },
  { slug: 'adam', name: 'Adam' },
  { slug: 'ondra', name: 'Ondra' },
] as const satisfies readonly TeamMemberData[]

export type TeamSlug = (typeof TEAM)[number]['slug']

// Typed by slug, so every dictionary must introduce each member.
export const team: readonly (TeamMemberData & { slug: TeamSlug })[] = TEAM

/** The team with each member's role and bio in one language. */
export function localizedTeam(dict: Dictionary): TeamMember[] {
  return team.map((member) => ({ ...member, ...dict.team.members[member.slug] }))
}
