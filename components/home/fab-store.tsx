'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { FAB_IMAGE_SIZE, fabImage, fabListings, fabStore, productCount } from '@/content/fab'
import { fitsInView, gsap, useScene } from '@/lib/motion'

const featured = fabListings.filter((listing) => listing.featured)

/** Unlit, as a scene looks in the editor before its lighting is built. */
const UNLIT = { filter: 'grayscale(1) brightness(0.4)' }
const LIT = { filter: 'grayscale(0) brightness(1)' }
/** The beam travels a little past both edges so it enters and leaves out of sight. */
const BEAM_FROM = -0.06
const BEAM_TO = 1.06

export function FabStore() {
  const ref = useRef<HTMLElement>(null)

  // Scene 4b — "Building lighting…". On desktop the store pins as a dark floor of
  // assets tilted away into the scene; a beam of light sweeps across it, and every
  // asset it crosses is baked into colour while the floor turns to face the
  // visitor. Phones (and screens too short to pin) get each asset lit as it rises in.
  useScene(ref, ({ desktop }) => {
    const stage = ref.current?.querySelector<HTMLElement>('[data-stage]')
    const floor = ref.current?.querySelector<HTMLElement>('[data-floor]')
    const status = ref.current?.querySelector<HTMLElement>('[data-status]')
    const assets = gsap.utils.toArray<HTMLElement>('[data-asset]')

    const riseIn = () => {
      for (const asset of assets) {
        const trigger = { trigger: asset, start: 'top 88%' }
        gsap.from(asset, { y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: trigger })
        gsap.fromTo(asset.querySelector('[data-bake]'), UNLIT, {
          ...LIT,
          duration: 1.2,
          delay: 0.35,
          ease: 'power2.out',
          scrollTrigger: trigger,
        })
      }
    }

    if (!desktop || !stage || !floor || !status) return riseIn()

    gsap.set(stage, { attr: { 'data-staged': '' } })
    if (!fitsInView(stage, window.innerHeight * 0.16)) {
      stage.removeAttribute('data-staged')
      return riseIn()
    }

    // When the beam crosses each asset's centre, measured on the flat layout.
    const width = floor.offsetWidth
    const bakedAt = assets.map((asset) => {
      const centre = (asset.offsetLeft + asset.offsetWidth / 2) / width
      return (centre - BEAM_FROM) / (BEAM_TO - BEAM_FROM)
    })
    const total = assets.length
    let shown = -1
    const report = (time: number) => {
      const baked = bakedAt.filter((at) => at <= time).length
      if (baked === shown) return
      shown = baked
      status.textContent = baked === total ? 'Lighting built' : `Building lighting… ${baked}/${total}`
      status.toggleAttribute('data-done', baked === total)
    }
    report(0)

    // Reported from the timeline itself: with scrub it keeps catching up after the scroll stops.
    const timeline = gsap.timeline({
      onUpdate: () => report(timeline.time()),
      scrollTrigger: { trigger: stage, start: 'top 16%', end: '+=170%', scrub: 1, pin: true },
    })
    timeline
      .fromTo(
        floor,
        { rotateX: 54, rotateZ: -8, scale: 0.84, yPercent: 4 },
        { rotateX: 0, rotateZ: 0, scale: 1, yPercent: 0, ease: 'power2.inOut', duration: 1 },
        0,
      )
      .fromTo('[data-beam]', { left: `${BEAM_FROM * 100}%` }, { left: `${BEAM_TO * 100}%`, ease: 'none', duration: 1 }, 0)
      .fromTo('[data-beam]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0)
      .to('[data-beam]', { opacity: 0, duration: 0.08 }, 0.92)
    assets.forEach((asset, index) => {
      const at = Math.max(0, bakedAt[index] - 0.05)
      timeline
        .fromTo(asset.querySelector('[data-bake]'), UNLIT, { ...LIT, ease: 'power2.out', duration: 0.16 }, at)
        .fromTo(asset.querySelector('[data-caption]'), { opacity: 0.3 }, { opacity: 1, duration: 0.16 }, at)
    })
    // A short hold on the lit store before the page moves on.
    timeline.to({}, { duration: 0.25 })

    // Keyboard users tabbing into the store land where everything is lit. A mouse
    // press focuses the link too, but jumping then would pull the card from under the pointer.
    const land = (event: FocusEvent) => {
      if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return
      const trigger = timeline.scrollTrigger
      if (trigger && window.scrollY < trigger.end) window.scrollTo(0, trigger.end)
    }
    stage.addEventListener('focusin', land)
    // Reverting the scene does not remove attributes it set, so the stage would keep its beam.
    return () => {
      stage.removeEventListener('focusin', land)
      stage.removeAttribute('data-staged')
      status.removeAttribute('data-done')
    }
  })

  return (
    <section ref={ref} id="fab" aria-labelledby="fab-nadpis" className="py-20 sm:py-40">
      <Container>
        <p className="mb-6 font-mono text-xs text-accent">{fabStore.eyebrow}</p>
        <SectionHeading id="fab-nadpis" title={fabStore.title} lead={fabStore.lead} />

        <div data-stage className="fab-stage mt-12 sm:mt-20">
          <p data-status aria-hidden="true" className="fab-status">
            Building lighting…
          </p>
          <div data-floor className="fab-floor relative">
            <span data-beam aria-hidden="true" className="fab-beam" />
            <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((listing) => (
                <li key={listing.slug} data-asset>
                  <a href={listing.url} target="_blank" rel="noopener noreferrer" className="fab-card group block">
                    <div data-bake className="fab-card__media relative aspect-video overflow-hidden bg-bg-soft">
                      {/* The title is in the preview and in the caption, so the image itself is decorative. */}
                      <Image
                        src={fabImage(listing.slug)}
                        alt=""
                        width={FAB_IMAGE_SIZE.width}
                        height={FAB_IMAGE_SIZE.height}
                        sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                      <span aria-hidden="true" className="fab-card__rim" />
                    </div>
                    <div data-caption>
                      <p className="mt-4 font-mono text-[11px] text-fg-faint">{listing.kind}</p>
                      <h3 className="mt-1.5 leading-snug font-semibold tracking-tight text-pretty transition-colors group-hover:text-accent-strong">
                        {listing.title}
                      </h3>
                    </div>
                    <span className="sr-only">(otevře se v novém okně na Fabu)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-line pt-8 sm:mt-20 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <p className="text-2xl font-semibold tracking-tight">{productCount(fabListings.length)} na Fabu</p>
            <ul aria-label="Technologie" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-fg-faint">
              {fabStore.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <ButtonLink href={fabStore.url} external withArrow>
            Celý obchod na Fabu
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
