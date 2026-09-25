'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { BulletList } from '@/components/ui/bullet-list'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { services } from '@/content/services'
import { media } from '@/content/site'
import { fitsInView, gsap, stepAt, useScene } from '@/lib/motion'

const numeral = (index: number) => String(index + 1).padStart(2, '0')

export function Services() {
  const ref = useRef<HTMLElement>(null)

  // Scene 2 — an index lit by a travelling spark. On desktop the stage pins: a
  // point of light runs down the rail of service names, lighting the one it
  // reaches, while its panel on the right is revealed from below as the last
  // one blurs away. Phones (and screens too short to pin) get a reveal per panel.
  useScene(ref, ({ desktop }) => {
    const stage = ref.current?.querySelector<HTMLElement>('[data-stage]')
    const panels = gsap.utils.toArray<HTMLElement>('[data-panel]')
    const items = gsap.utils.toArray<HTMLElement>('[data-index-item]')

    const reveal = () => {
      for (const panel of panels) {
        gsap.from(panel, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 88%' },
        })
      }
    }

    if (!desktop || !stage) return reveal()

    gsap.set(stage, { attr: { 'data-staged': '' } })
    // The staged layout must fit below the header to be pinned whole.
    if (!fitsInView(stage, window.innerHeight * 0.14)) {
      stage.removeAttribute('data-staged')
      return reveal()
    }

    const count = panels.length
    const light = (active: number) => {
      items.forEach((item, index) => item.toggleAttribute('data-active', index === active))
    }
    light(0)

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top 14%',
        end: `+=${count * 70}%`,
        scrub: 1,
        pin: true,
        onUpdate: () => light(stepAt(timeline.time(), count)),
      },
    })
    // One time unit per service; each change is centred between two units, so
    // the lit name (the nearest unit) always matches the panel on show.
    for (let index = 1; index < count; index++) {
      const at = index - 0.8
      const incoming = panels[index]
      timeline
        .to(panels[index - 1], { opacity: 0, y: -50, filter: 'blur(10px)', ease: 'power2.in', duration: 0.35 }, at)
        .fromTo(
          incoming,
          { opacity: 0, y: 70, filter: 'blur(6px)', clipPath: 'inset(100% 0% 0% 0%)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0%)', ease: 'power3.out', duration: 0.45 },
          at + 0.15,
        )
        .fromTo(
          incoming.querySelectorAll('li'),
          { x: 24, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out', duration: 0.25, stagger: 0.05 },
          at + 0.35,
        )
        .to('[data-spark]', { top: `${(index / (count - 1)) * 100}%`, ease: 'power2.inOut', duration: 0.6 }, at)
    }
    // A short hold on the last service before the section moves on.
    timeline.to({}, { duration: 0.3 })

    return () => items.forEach((item) => item.removeAttribute('data-active'))
  })

  return (
    <section ref={ref} id="sluzby" aria-labelledby="sluzby-nadpis" className="pt-16 pb-20 sm:pt-24 sm:pb-40">
      <Container>
        <SectionHeading
          id="sluzby-nadpis"
          title="Web je základ. 3D a AI jsou důvod, proč bude lepší."
          lead="Navrhujeme a stavíme weby na míru. A když to dává smysl, přidáme 3D, splaty nebo AI agenta, který za vás odvede kus práce."
        />

        <div data-stage className="services-stage mt-12 sm:mt-20">
          {/* The lit index is drawn only on the pinned stage; the panels carry the real headings. */}
          <div data-index aria-hidden="true" className="services-index">
            <span className="services-index__rail">
              <span data-spark className="services-index__spark" />
            </span>
            <ol>
              {services.map((service, index) => (
                <li key={service.id} data-index-item className="services-index__item">
                  <span className="services-index__num">{numeral(index)}</span>
                  {service.title}
                </li>
              ))}
            </ol>
          </div>

          <div className="services-panels grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => (
              <article
                key={service.id}
                data-panel
                className="service-panel relative overflow-hidden border border-line-strong bg-bg-soft p-7 sm:p-10"
              >
                <span aria-hidden="true" className="service-panel__numeral">
                  {numeral(index)}
                </span>
                <h3 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">{service.title}</h3>
                <p className="relative mt-4 max-w-md text-pretty text-fg-dim">{service.summary}</p>
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
                <BulletList items={service.points} className="relative mt-8 text-sm" />
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
