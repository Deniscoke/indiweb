import Image from 'next/image'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { aria } from '@/content/aria'
import { media } from '@/content/site'

export function AriaTeaser() {
  return (
    <section id="aria" aria-labelledby="aria-nadpis" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-accent/30 bg-linear-to-br from-accent/15 via-bg-soft to-bg p-8 sm:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-xs tracking-[0.2em] text-accent uppercase">Náš vlastní produkt</p>
                <h2
                  id="aria-nadpis"
                  className="mt-4 font-display text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl"
                >
                  {aria.headline}
                </h2>
                <p className="mt-5 text-lg text-fg-dim">{aria.description}</p>
                <BulletList items={aria.capabilities.slice(0, 3)} className="mt-8 text-sm" />
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/aria" withArrow>
                    Více o Arii
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
                className="mx-auto h-auto w-full max-w-sm"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
