import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { aria } from '@/content/aria'
import { ScrambleText } from './scramble-text'
import { VoiceDots } from './voice-dots'

const INQUIRY_HREF = '/?sluzba=ai#kontakt'

export function AriaPage() {
  return (
    <>
      <section aria-labelledby="aria-nadpis">
        <Container className="grid min-h-svh items-center gap-16 pt-36 pb-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-mono text-xs text-accent">Náš vlastní produkt</p>
            <h1
              id="aria-nadpis"
              className="lit mt-6 text-[clamp(5rem,16vw,12rem)] leading-[0.85] font-semibold tracking-[-0.06em]"
            >
              {aria.name}
            </h1>
            <p className="mt-8 font-mono text-xl text-balance sm:text-2xl">
              <ScrambleText text={aria.tagline} />
            </p>
            <p className="mt-6 max-w-xl text-lg text-fg-dim">{aria.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={INQUIRY_HREF}>Chci Ariu pro svou firmu</ButtonLink>
              <ButtonLink href={aria.url} external variant="ghost" withArrow>
                Vyzkoušet Ariu
              </ButtonLink>
            </div>
          </div>
          <VoiceDots />
        </Container>
      </section>

      <section aria-labelledby="aria-umi" className="py-28">
        <Container>
          <SectionHeading id="aria-umi" title="Telefon, který nikdy nezvoní naprázdno." />
          <ul className="mt-16 grid border-t border-line md:grid-cols-2">
            {aria.capabilities.map((capability) => (
              <li key={capability} className="border-b border-line py-8 text-2xl tracking-tight md:odd:pr-10 md:even:pl-10 md:even:border-l">
                <p>{capability}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-pro-koho" className="py-28">
        <Container>
          <SectionHeading id="aria-pro-koho" title="Pro všechny, kdo nestíhají zvedat telefon." />
          <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-4 font-mono text-sm text-fg-dim">
            {aria.audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-nasazeni" className="py-28">
        <Container>
          <SectionHeading id="aria-nasazeni" title="Jak Ariu spustíme u vás." />
          <StepList steps={aria.rollout} className="mt-16" />
        </Container>
      </section>

      <section aria-labelledby="aria-cta" className="py-28">
        <Container>
          <div className="relative border-y border-line py-20 text-center">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent to-transparent"
            />
            <h2 id="aria-cta" className="lit text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
              Chcete Ariu i u vás?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-fg-dim">
              Napište nám, jaké hovory vám chodí. Ozveme se do 24 hodin.
            </p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href={INQUIRY_HREF}>Chci Ariu pro svou firmu</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
