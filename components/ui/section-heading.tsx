import { cn } from '@/lib/cn'
import { Reveal } from './reveal'

type SectionHeadingProps = {
  id: string
  title: string
  lead?: string
  className?: string
}

/** Section title revealed by a sweep of light, with an optional short lead. */
export function SectionHeading({ id, title, lead, className }: SectionHeadingProps) {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end', className)}>
      <Reveal>
        <h2
          id={id}
          className="text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl"
        >
          {title}
        </h2>
      </Reveal>
      {lead && <p className="max-w-md text-lg text-pretty text-fg-dim lg:justify-self-end">{lead}</p>}
    </div>
  )
}
