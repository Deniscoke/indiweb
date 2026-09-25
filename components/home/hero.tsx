'use client'

import { Fragment, useRef } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { hero } from '@/content/site'
import { cn } from '@/lib/cn'
import { gsap, useScene } from '@/lib/motion'

// Where each line sits across the width: a diagonal the light can travel along.
const LINE_PLACEMENT = ['justify-self-start', 'justify-self-center', 'justify-self-end']

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  // Scene 1 — flying through the aperture: the lines part as the camera passes
  // between them, a ring of light grows past the edges, and a flash hands over
  // to the services.
  useScene(ref, ({ desktop }) => {
    const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]')
    const layer = ref.current?.querySelector<HTMLElement>('[data-aperture-layer]')
    // The scrubbed animation trails the scroll by up to a second, so on a fast
    // scroll the ring could still be lit when the section starts to move and its
    // bottom edge would cut it off. The layer is hidden the moment the pin ends.
    const setGone = (gone: boolean) => layer?.toggleAttribute('data-gone', gone)
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: desktop ? '+=100%' : 'bottom top',
        scrub: desktop ? 1 : 0.6,
        pin: desktop,
        onLeave: () => setGone(true),
        onEnterBack: () => setGone(false),
      },
    })
    timeline
      .to(lines[0], { xPercent: -30, opacity: 0, ease: 'power2.in' }, 0)
      .to(lines[1], { scale: 1.35, opacity: 0, ease: 'power2.in' }, 0.08)
      .to(lines[2], { xPercent: 30, opacity: 0, ease: 'power2.in' }, 0)
      .to('[data-hero-footer]', { y: 60, opacity: 0, ease: 'power1.in', duration: 0.5 }, 0)

    if (desktop) {
      timeline
        // A gentle ease keeps the ring on screen long enough to be read as a ring.
        .fromTo('[data-aperture]', { scale: 0.05, opacity: 0 }, { scale: 3.2, opacity: 1, ease: 'power1.in', duration: 0.85 }, 0.05)
        .to('[data-aperture-flash]', { opacity: 0.55, duration: 0.12, ease: 'power2.in' }, 0.8)
        // The ring dissolves into the flash, so it is gone before the section
        // scrolls away and its bottom edge could cut the ring off.
        .to('[data-aperture]', { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0.85)
        .to('[data-aperture-flash]', { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0.92)
    }
    return () => setGone(false)
  })

  return (
    <section ref={ref} aria-labelledby="hero-nadpis" className="relative overflow-hidden">
      <div aria-hidden="true" data-aperture-layer className="aperture-layer">
        <div data-aperture className="aperture-ring" />
        <div data-aperture-flash className="aperture-flash" />
      </div>
      <Container className="relative flex min-h-svh flex-col justify-between pt-32 pb-10 sm:pt-36 sm:pb-12">
        <h1
          id="hero-nadpis"
          className="grid gap-4 text-[clamp(3.25rem,13vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.05em]"
        >
          {hero.lines.map((line, index) => (
            // The space keeps the lines apart for screen readers; grid layout hides it.
            <Fragment key={line}>
              {index > 0 && ' '}
              <span data-hero-line className={cn('lit block', LINE_PLACEMENT[index])}>
                {line}
              </span>
            </Fragment>
          ))}
        </h1>

        <div
          data-hero-footer
          className="mt-16 grid gap-10 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end"
        >
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
