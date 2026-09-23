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

const CARD = 'flex h-full flex-col rounded-3xl border border-line bg-surface p-8'

export function TeamCard({ member }: { member: TeamMember }) {
  const body = (
    <>
      {member.photo ? (
        <Image
          src={member.photo}
          alt=""
          width={80}
          height={80}
          className="size-20 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-20 items-center justify-center rounded-full border border-line-strong bg-bg-soft font-display text-2xl font-semibold text-accent"
        >
          {getInitials(member.name)}
        </span>
      )}
      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{member.name}</h3>
      <p className="mt-1 text-sm text-accent">{member.role}</p>
      <p className="mt-4 text-fg-dim">{member.bio}</p>
      {member.website && (
        <span className="mt-auto pt-6 text-sm text-fg-dim">
          Osobní web <span aria-hidden="true">↗</span>
          {' '}
          <span className="sr-only">(otevře se v novém okně)</span>
        </span>
      )}
    </>
  )

  if (member.website) {
    return (
      <a
        href={member.website}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(CARD, 'transition-colors hover:border-line-strong hover:bg-white/5')}
      >
        {body}
      </a>
    )
  }

  return <div className={CARD}>{body}</div>
}
