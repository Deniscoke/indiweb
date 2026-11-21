'use client'

import { useI18n } from '@/components/i18n/i18n-provider'
import { cn } from '@/lib/cn'

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  const { dict } = useI18n()
  return (
    <ul aria-label={dict.common.tags} className={cn('flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-fg-faint', className)}>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}
