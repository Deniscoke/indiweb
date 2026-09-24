import { ScrambleText } from '@/components/aria/scramble-text'
import { VoiceDots } from '@/components/aria/voice-dots'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { aria } from '@/content/aria'

export function AriaTeaser() {
  return (
    <section id="aria" aria-labelledby="aria-nadpis" className="py-20 sm:py-40">
      <Container>
        <div className="relative overflow-hidden border-y border-line py-12 sm:py-24">
          {/* The glass rim from the intro, as a thin line of refracted light. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent to-transparent"
          />
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2
                id="aria-nadpis"
                className="font-mono text-3xl leading-[1.15] tracking-tight text-balance sm:text-4xl"
              >
                <ScrambleText text={aria.headline} />
              </h2>
              <p className="mt-8 max-w-xl text-lg text-fg-dim">{aria.description}</p>
              <BulletList items={aria.capabilities.slice(0, 3)} className="mt-8" />
              <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/aria">Více o Arii</ButtonLink>
                <ButtonLink href={aria.url} external variant="ghost" withArrow>
                  Vyzkoušet Ariu
                </ButtonLink>
              </div>
            </div>
            <VoiceDots />
          </div>
        </div>
      </Container>
    </section>
  )
}
