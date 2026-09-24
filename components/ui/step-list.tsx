import type { Step } from '@/content/types'
import { cn } from '@/lib/cn'

/** An ordered sequence drawn along one line of light, numbered because order matters. */
export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn('grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8', className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="relative border-t border-line pt-6">
          <span
            aria-hidden="true"
            className="absolute -top-px left-0 h-px w-16 bg-linear-to-r from-accent to-transparent"
          />
          <p aria-hidden="true" className="font-mono text-xs text-accent">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">{step.title}</h3>
          <p className="mt-2 text-fg-dim">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
