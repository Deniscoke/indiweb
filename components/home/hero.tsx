import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { hero } from '@/content/site'
import { RotatingWord } from './rotating-word'

export function Hero() {
  return (
    <section aria-labelledby="hero-nadpis">
      <Container className="flex min-h-svh flex-col items-center justify-center pt-28 pb-20 text-center">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-1.5 text-xs tracking-[0.18em] text-fg-dim uppercase">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {hero.eyebrow}
        </p>
        <h1
          id="hero-nadpis"
          className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-7xl"
        >
          {hero.titleLead}{' '}
          <span className="block">
            {hero.titleRotatingPrefix} <RotatingWord words={hero.rotatingWords} />
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-pretty text-fg-dim">{hero.subtitle}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#kontakt" withArrow>
            Napište nám
          </ButtonLink>
          <ButtonLink href="#projekty" variant="ghost">
            Ukázky práce
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-fg-faint">{hero.hint}</p>
      </Container>
    </section>
  )
}
