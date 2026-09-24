import Image from 'next/image'
import type { TeamMember } from '@/content/types'
import { cn } from '@/lib/cn'

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}

const ROW =
  'grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 py-8 md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto] md:gap-x-10'

/** One team member as a row of the team list; the whole row links to a personal site if there is one. */
export function TeamCard({ member }: { member: TeamMember }) {
  const body = (
    <>
      {member.photo ? (
        <Image src={member.photo} alt="" width={56} height={56} className="size-14 rounded-full object-cover grayscale" />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-full border border-line-strong font-mono text-xs text-fg-dim"
        >
          {getInitials(member.name)}
        </span>
      )}
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{member.name}</h3>
      <p className="col-start-2 font-mono text-xs text-accent md:col-start-auto">{member.role}</p>
      <p className="col-start-2 text-fg-dim md:col-start-auto">{member.bio}</p>
      {member.website ? (
        <span className="col-start-2 text-sm text-fg-dim md:col-start-auto">
          Osobní web <span aria-hidden="true">↗</span>{' '}
          <span className="sr-only">(otevře se v novém okně)</span>
        </span>
      ) : (
        <span className="hidden md:block" />
      )}
    </>
  )

  if (member.website) {
    return (
      <a
        href={member.website}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(ROW, 'row-light transition-colors hover:text-white')}
      >
        {body}
      </a>
    )
  }

  return <div className={ROW}>{body}</div>
}
