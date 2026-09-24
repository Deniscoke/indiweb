import { cn } from '@/lib/cn'

export function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span
            aria-hidden="true"
            className="mt-[0.62em] size-1 shrink-0 rounded-full bg-accent shadow-[0_0_8px_1px_rgb(217_184_255/0.6)]"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}
