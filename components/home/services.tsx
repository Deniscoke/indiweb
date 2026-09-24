'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BulletList } from '@/components/ui/bullet-list'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { services } from '@/content/services'
import { media } from '@/content/site'
import type { ServiceId } from '@/content/types'
import { cn } from '@/lib/cn'

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
      <path d="M1 9h16" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 1v16"
        stroke="currentColor"
        strokeWidth="1.5"
        className={cn('origin-center transition-transform duration-500', open && 'scale-y-0')}
      />
    </svg>
  )
}

export function Services() {
  const [open, setOpen] = useState<Set<ServiceId>>(
    () => new Set(services.filter((service) => service.featured).map((service) => service.id)),
  )

  const toggle = (id: ServiceId) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section id="sluzby" aria-labelledby="sluzby-nadpis" className="py-28 sm:py-40">
      <Container>
        <SectionHeading
          id="sluzby-nadpis"
          title="Web je základ. 3D a AI jsou důvod, proč bude lepší."
          lead="Navrhujeme a stavíme weby na míru. A když to dává smysl, přidáme 3D, splaty nebo AI agenta, který za vás odvede kus práce."
        />

        <div className="mt-20 border-b border-line">
          {services.map((service) => {
            const isOpen = open.has(service.id)
            const panelId = `sluzba-${service.id}`
            return (
              <article key={service.id} className="row-light border-t border-line">
                <div className="relative grid gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-baseline md:gap-10">
                  <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    <button
                      type="button"
                      onClick={() => toggle(service.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="text-left after:absolute after:inset-0"
                    >
                      {service.title}
                    </button>
                  </h3>
                  <p className="text-fg-dim">{service.summary}</p>
                  <span className="hidden text-fg-dim md:block">
                    <PlusIcon open={isOpen} />
                  </span>
                </div>
                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="grid gap-10 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:gap-10"
                >
                  {service.featured ? (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                      <Image
                        src={media.laptop.src}
                        alt={media.laptop.alt}
                        fill
                        sizes="(min-width: 768px) 35vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="hidden md:block" />
                  )}
                  <BulletList items={service.points} className="text-lg" />
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
