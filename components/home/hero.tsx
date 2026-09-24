import { Fragment } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { hero } from '@/content/site'
import { cn } from '@/lib/cn'

// Where each line sits across the width: a diagonal the light can travel along.
const LINE_PLACEMENT = ['justify-self-start', 'justify-self-center', 'justify-self-end']

export function Hero() {
  return (
    <section aria-labelledby="hero-nadpis" className="relative overflow-hidden">
      <Container className="relative flex min-h-svh flex-col justify-between pt-32 pb-10 sm:pt-36 sm:pb-12">
        <h1
          id="hero-nadpis"
          className="grid gap-4 text-[clamp(3.25rem,13vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.05em]"
        >
          {hero.lines.map((line, index) => (
            // The space keeps the lines apart for screen readers; grid layout hides it.
            <Fragment key={line}>
              {index > 0 && ' '}
              <span className={cn('lit block', LINE_PLACEMENT[index])}>{line}</span>
            </Fragment>
          ))}
        </h1>

        <div className="mt-16 grid gap-10 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-lg">
            <p className="text-lg text-pretty text-fg-dim">{hero.subtitle}</p>
            <p className="mt-4 font-mono text-xs text-fg-faint">{hero.hint}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#kontakt">Napište nám</ButtonLink>
            <ButtonLink href="#projekty" variant="ghost">
              Ukázky práce
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
