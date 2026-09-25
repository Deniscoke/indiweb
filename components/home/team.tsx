'use client'

import { useRef } from 'react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { team } from '@/content/team'
import { gsap, useScene } from '@/lib/motion'
import { TeamCard } from './team-card'

export function Team() {
  const ref = useRef<HTMLElement>(null)

  // The crew steps forward one by one, each row sliding in behind a line of light.
  useScene(ref, ({ desktop }) => {
    gsap.from('[data-member]', {
      x: desktop ? -80 : 0,
      y: desktop ? 0 : 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: '[data-crew]', start: 'top 80%' },
    })
    gsap.from('[data-member-line]', {
      scaleX: 0,
      duration: 1.1,
      ease: 'power2.inOut',
      stagger: 0.15,
      scrollTrigger: { trigger: '[data-crew]', start: 'top 80%' },
    })
  })

  return (
    <section ref={ref} id="o-nas" aria-labelledby="o-nas-nadpis" className="overflow-x-clip py-20 sm:py-40">
      <Container>
        <SectionHeading
          id="o-nas-nadpis"
          title="Tři kluci, kteří tvoří weby, 3D a AI."
          lead="Malý tým znamená, že mluvíte přímo s námi — bez prostředníků a přeposílání."
        />
        <ul data-crew className="mt-12 border-b border-line sm:mt-20">
          {team.map((member) => (
            <li key={member.slug} className="relative border-t border-line">
              <span
                aria-hidden="true"
                data-member-line
                className="absolute -top-px left-0 h-px w-full origin-left bg-linear-to-r from-accent via-accent/40 to-transparent"
              />
              <div data-member>
                <TeamCard member={member} />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
