'use client'

import { useRef } from 'react'
import { ScrambleText } from '@/components/aria/scramble-text'
import { VoiceDemo } from '@/components/aria/voice-demo'
import { VoiceDots } from '@/components/aria/voice-dots'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { aria } from '@/content/aria'
import { fitsInView, gsap, useScene } from '@/lib/motion'

const FLOODED = 'is-flooded'
const TRY_ARIA_ID = 'vyzkouset-ariu'
const DRY = 'circle(0% at 72% 50%)'
const WET = 'circle(75% at 72% 50%)'

/** `voiceDemo`: the live call with Aria is set up (ElevenLabs key and agent), so visitors can try her. */
export function AriaTeaser({ voiceDemo = false }: { voiceDemo?: boolean }) {
  const ref = useRef<HTMLElement>(null)

  // Scene 3 — Aria's voice floods the screen: a pool of the intro's lilac light
  // spreads from the speaking dots until the whole section is lit, the text
  // turns dark on it, and the light drains again before the projects.
  useScene(ref, ({ desktop }) => {
    const section = ref.current
    if (!section) return
    const setFlooded = (flooded: boolean) => section.classList.toggle(FLOODED, flooded)

    if (!desktop) {
      gsap.fromTo(
        '[data-flood]',
        { clipPath: DRY },
        {
          clipPath: WET,
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 45%',
            end: 'bottom 55%',
            toggleActions: 'play reverse play reverse',
            onToggle: (self) => setFlooded(self.isActive),
          },
        },
      )
      return () => setFlooded(false)
    }

    // Pinned only when the whole scene fits; otherwise it plays out as it scrolls past.
    const pinned = fitsInView(section)
    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: pinned ? 'center center' : 'top 75%',
          end: pinned ? '+=150%' : 'bottom 25%',
          scrub: 1,
          pin: pinned,
          // Dark text only while the light covers most of the section.
          onUpdate: (self) => setFlooded(self.progress > 0.3 && self.progress < 0.88),
        },
      })
      .fromTo('[data-flood]', { clipPath: DRY }, { clipPath: WET, ease: 'power2.in', duration: 0.4 }, 0)
      .fromTo('[data-aria-copy]', { y: 40 }, { y: -20, ease: 'none', duration: 1 }, 0)
      .to('[data-flood]', { clipPath: DRY, ease: 'power2.out', duration: 0.2 }, 0.8)
    return () => setFlooded(false)
  })

  return (
    <section ref={ref} id="aria" aria-labelledby="aria-nadpis" className="aria-scene py-20 sm:py-28">
      <div aria-hidden="true" data-flood className="aria-flood" />
      <Container>
        <div className="relative border-y border-line py-12 sm:py-20">
          {/* The glass rim from the intro, as a thin line of refracted light. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent to-transparent"
          />
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div data-aria-copy>
              <h2
                id="aria-nadpis"
                className="font-mono text-3xl leading-[1.15] tracking-tight text-balance sm:text-4xl"
              >
                <ScrambleText text={aria.headline} />
              </h2>
              <p className="aria-scene__dim mt-8 max-w-xl text-lg text-fg-dim">{aria.description}</p>
              <BulletList items={aria.capabilities.slice(0, 3)} className="mt-8" />
              <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/aria">Více o Arii</ButtonLink>
                {/* The call is right here; on phones it sits below the pitch, so this jumps to it. */}
                {voiceDemo && (
                  <ButtonLink href={`#${TRY_ARIA_ID}`} variant="ghost">
                    Vyzkoušet Ariu
                  </ButtonLink>
                )}
              </div>
            </div>
            <div id={TRY_ARIA_ID} data-aria-dots className="scroll-mt-28">
              {voiceDemo ? <VoiceDemo /> : <VoiceDots />}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
