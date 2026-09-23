import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BrowserFrameProps = { children: ReactNode; url?: string; className?: string }

export function BrowserFrame({ children, url, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-line-strong bg-bg-soft shadow-2xl shadow-black/50',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-fg-faint/40" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-fg-faint/40" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-fg-faint/40" />
        {url && (
          <span className="ml-3 truncate rounded-md bg-surface px-3 py-1 text-xs text-fg-faint">
            {url}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
