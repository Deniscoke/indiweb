'use client'

import { useRef } from 'react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { projects } from '@/content/projects'
import { cn } from '@/lib/cn'
import { fitsInView, gsap, useScene } from '@/lib/motion'
import { ProjectCard } from './project-card'

export function Projects() {
  const ref = useRef<HTMLElement>(null)

  // Scene 4 — the work flies in out of the dark: on desktop the gallery pins and
  // each project travels from deep in the scene to its place, tilting upright
  // as it lands. Phones get a rise-in per project.
  useScene(ref, ({ desktop }) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-project]')

    if (!desktop) {
      for (const card of cards) {
        gsap.from(card, {
          y: 60,
          scale: 0.94,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        })
      }
      return
    }

    // Pinned only when both cards fit below the header; otherwise they fly in as they scroll past.
    const pinned = fitsInView(ref.current?.querySelector('[data-gallery]'), window.innerHeight * 0.18)
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-gallery]',
        start: pinned ? 'top 18%' : 'top 90%',
        end: pinned ? `+=${cards.length * 70}%` : 'center 55%',
        scrub: 1,
        pin: pinned,
      },
    })
    cards.forEach((card, index) => {
      timeline.fromTo(
        card,
        {
          z: -1400,
          xPercent: index % 2 ? 40 : -40,
          yPercent: -20,
          rotateY: index % 2 ? -28 : 28,
          rotateX: 12,
          opacity: 0,
        },
        { z: 0, xPercent: 0, yPercent: 0, rotateY: 0, rotateX: 0, opacity: 1, ease: 'power3.out', duration: 1 },
        index * 0.7,
      )
    })

    // Keyboard users tabbing into a card that is still in flight land where
    // every card has arrived, so focus never sits on something invisible.
    const gallery = ref.current?.querySelector('[data-gallery]')
    const land = () => {
      const trigger = timeline.scrollTrigger
      if (trigger && window.scrollY < trigger.end) window.scrollTo(0, trigger.end)
    }
    gallery?.addEventListener('focusin', land)
    return () => gallery?.removeEventListener('focusin', land)
  })

  return (
    <section ref={ref} id="projekty" aria-labelledby="projekty-nadpis" className="py-20 sm:py-40">
      <Container>
        <SectionHeading
          id="projekty-nadpis"
          title="Každý klient dostane web, který sedí jemu. Ne šabloně."
          lead="Výtahová firma potřebuje něco jiného než terapeutka. Podívejte se, jak to vypadá v praxi."
        />
        <ul data-gallery className="project-gallery mt-12 grid gap-16 sm:mt-20 md:grid-cols-2 md:gap-12">
          {projects.map((project, index) => (
            // Every other project steps down for an editorial rhythm.
            <li key={project.slug} data-project className={cn(index % 2 === 1 && 'md:mt-40')}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
