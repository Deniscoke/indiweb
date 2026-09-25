'use client'

import Image from 'next/image'
import { useRef, type CSSProperties } from 'react'
import { BulletList } from '@/components/ui/bullet-list'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { services } from '@/content/services'
import { media } from '@/content/site'
import { gsap, useScene } from '@/lib/motion'

export function Services() {
  const ref = useRef<HTMLElement>(null)

  // Scene 2 — panels like frames of a graphic novel: on desktop the stage pins
  // and each service slides in over the last, whose frame recedes into depth,
  // before its caption of points pops out. Phones get a simple reveal per panel.
  useScene(ref, ({ desktop }) => {
    const panels = gsap.utils.toArray<HTMLElement>('[data-panel]')

    if (!desktop) {
      for (const panel of panels) {
        gsap.from(panel, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 88%' },
        })
      }
      return
    }

    gsap.set('[data-stage]', { attr: { 'data-staged': '' } })
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-stage]',
        start: 'top 14%',
        end: `+=${panels.length * 75}%`,
        scrub: 1,
        pin: true,
      },
    })
    panels.forEach((panel, index) => {
      // The first frame is already on the stage when it pins; the rest slide in over it.
      if (index === 0) return
      const at = (index - 1) * 1.2
      timeline
        .to(panels.slice(0, index), { scale: '-=0.05', opacity: '-=0.25', ease: 'none', duration: 0.8 }, at)
        .fromTo(
          panel,
          { yPercent: 55, rotate: index % 2 ? 3 : -3, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
          { yPercent: 0, rotate: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', ease: 'power3.out', duration: 1 },
          at,
        )
        .fromTo(
          panel.querySelector('[data-caption]'),
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
          at + 0.55,
        )
    })
  })

  return (
    <section ref={ref} id="sluzby" aria-labelledby="sluzby-nadpis" className="pt-16 pb-20 sm:pt-24 sm:pb-40">
      <Container>
        <SectionHeading
          id="sluzby-nadpis"
          title="Web je základ. 3D a AI jsou důvod, proč bude lepší."
          lead="Navrhujeme a stavíme weby na míru. A když to dává smysl, přidáme 3D, splaty nebo AI agenta, který za vás odvede kus práce."
        />

        <div data-stage className="services-stage mt-12 grid gap-6 sm:mt-20 lg:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.id}
              data-panel
              className="service-panel relative border border-line-strong bg-bg-soft p-7 sm:p-10"
              style={{ '--panel-index': index } as CSSProperties}
            >
              <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{service.title}</h3>
              <p className="mt-4 max-w-md text-pretty text-fg-dim">{service.summary}</p>
              {service.featured && (
                <div className="service-panel__media relative mt-8 aspect-[16/9] overflow-hidden">
                  <Image
                    src={media.laptop.src}
                    alt={media.laptop.alt}
                    fill
                    sizes="(min-width: 1024px) 35vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div data-caption className="service-caption mt-8 border border-line bg-bg p-5">
                <BulletList items={service.points} className="text-sm" />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
