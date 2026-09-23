import { cn } from '@/lib/cn'

type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ id, eyebrow, title, lead, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl"
      >
        {title}
      </h2>
      {lead && <p className="mt-5 text-lg text-pretty text-fg-dim">{lead}</p>}
    </div>
  )
}
