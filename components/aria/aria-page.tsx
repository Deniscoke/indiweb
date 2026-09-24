import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { aria } from '@/content/aria'
import { media } from '@/content/site'

const INQUIRY_HREF = '/?sluzba=ai#kontakt'

export function AriaPage() {
  return (
    <>
      <section aria-labelledby="aria-nadpis">
        <Container className="grid min-h-svh items-center gap-12 pt-32 pb-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs tracking-[0.2em] text-accent uppercase">Náš vlastní produkt</p>
            <h1
              id="aria-nadpis"
              className="mt-4 font-display text-6xl font-semibold tracking-tight sm:text-8xl"
            >
              {aria.name}
            </h1>
            <p className="mt-6 font-display text-2xl text-balance sm:text-3xl">{aria.tagline}</p>
            <p className="mt-6 max-w-xl text-lg text-fg-dim">{aria.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={INQUIRY_HREF} withArrow>
                Chci Ariu pro svou firmu
              </ButtonLink>
              <ButtonLink href={aria.url} external variant="ghost" withArrow>
                Vyzkoušet Ariu
              </ButtonLink>
            </div>
          </div>
          <Image
            src={media.phone.src}
            alt={media.phone.alt}
            width={media.phone.width}
            height={media.phone.height}
            sizes="(min-width: 1024px) 35vw, 80vw"
            loading="eager"
            fetchPriority="high"
            className="mx-auto h-auto w-full max-w-sm"
          />
        </Container>
      </section>

      <section aria-labelledby="aria-umi" className="py-24">
        <Container>
          <SectionHeading id="aria-umi" eyebrow="Co Aria zvládne" title="Telefon, který nikdy nezvoní naprázdno." />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {aria.capabilities.map((capability, index) => (
              <li key={capability}>
                <Reveal delay={index * 80} className="h-full">
                  <p className="h-full rounded-3xl border border-line bg-surface p-7 text-lg">{capability}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-pro-koho" className="py-24">
        <Container>
          <SectionHeading id="aria-pro-koho" eyebrow="Pro koho je" title="Pro všechny, kdo nestíhají zvedat telefon." />
          <ul className="mt-12 flex flex-wrap gap-3">
            {aria.audience.map((item) => (
              <li key={item} className="rounded-full border border-line-strong px-5 py-2.5 text-fg-dim">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-nasazeni" className="py-24">
        <Container>
          <SectionHeading id="aria-nasazeni" eyebrow="Nasazení" title="Jak Ariu spustíme u vás." />
          <StepList steps={aria.rollout} className="mt-12" />
        </Container>
      </section>

      <section aria-labelledby="aria-cta" className="py-24">
        <Container>
          <Reveal>
            <div className="rounded-[2rem] border border-accent/30 bg-linear-to-br from-accent/15 via-bg-soft to-bg p-10 text-center sm:p-16">
              <h2 id="aria-cta" className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Chcete Ariu i u vás?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-fg-dim">
                Napište nám, jaké hovory vám chodí. Ozveme se do 24 hodin.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href={INQUIRY_HREF} withArrow>
                  Chci Ariu pro svou firmu
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
