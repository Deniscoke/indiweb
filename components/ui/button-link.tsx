import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  external?: boolean
  withArrow?: boolean
  className?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300'

const VARIANTS = {
  primary: 'bg-accent text-bg hover:bg-accent-strong',
  ghost: 'border border-line-strong text-fg hover:border-fg-faint hover:bg-surface',
}

function Arrow({ external }: { external: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {external ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  withArrow = false,
  className,
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], className)
  const content = (
    <>
      {children}
      {withArrow && <Arrow external={external} />}
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
        {' '}
        <span className="sr-only">(otevře se v novém okně)</span>
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
