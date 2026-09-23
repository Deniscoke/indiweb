import { cn } from '@/lib/cn'

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul aria-label="Štítky" className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-fg-dim">
          {tag}
        </li>
      ))}
    </ul>
  )
}
