import type { Step } from '@/content/types'
import { cn } from '@/lib/cn'
import { Reveal } from './reveal'

export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-4', className)}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal delay={index * 100} className="h-full">
            <div className="h-full rounded-3xl border border-line bg-surface p-7">
              <p aria-hidden="true" className="font-display text-sm text-accent">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-fg-dim">{step.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
