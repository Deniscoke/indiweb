import { cn } from '@/lib/cn'

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul aria-label="Štítky" className={cn('flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-fg-faint', className)}>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}
