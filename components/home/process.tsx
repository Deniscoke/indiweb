'use client'

import { useRef } from 'react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { processSteps } from '@/content/process'
import { gsap, useScene } from '@/lib/motion'

export function Process() {
  const ref = useRef<HTMLElement>(null)

  // Scene 5 — the road from first message to launch: on desktop the section pins
  // and the steps travel sideways past a line of light that grows with the
  // journey, each step brightening as it reaches the middle. Phones keep the
  // vertical list with a rise-in per step.
  useScene(ref, ({ desktop }) => {
    const steps = gsap.utils.toArray<HTMLElement>('[data-track] li')

    if (!desktop) {
      for (const step of steps) {
        gsap.from(step, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 88%' },
        })
      }
      return
    }

    gsap.set('[data-track]', { attr: { 'data-staged': '' } })
    const list = ref.current?.querySelector<HTMLElement>('[data-track] ol')
    const track = ref.current?.querySelector<HTMLElement>('[data-track]')
    if (!list || !track) return
    const distance = () => Math.max(0, list.scrollWidth - track.clientWidth)

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        // Pinned from just above the heading, so the padding does not take up the screen.
        start: () => `top+=${Math.max(0, parseFloat(getComputedStyle(track.closest('section') ?? track).paddingTop) - 88)} top`,
        end: () => `+=${distance() + window.innerHeight * 0.4}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    })
    // Linear throughout, so the timeline can drive the steps' own triggers.
    timeline
      .to(list, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
      .fromTo('[data-process-line]', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)

    for (const step of steps) {
      gsap.fromTo(
        step,
        { opacity: 0.25 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: step,
            containerAnimation: timeline,
            start: 'left 85%',
            end: 'left 45%',
            scrub: true,
          },
        },
      )
    }
  })

  return (
    <section ref={ref} id="postup" aria-labelledby="postup-nadpis" className="overflow-x-clip py-20 sm:py-40">
      <Container>
        <SectionHeading id="postup-nadpis" title="Od první zprávy po spuštění ve čtyřech krocích." />
        <div data-track className="process-track relative mt-12 sm:mt-20">
          <span aria-hidden="true" data-process-line className="process-line" />
          <StepList steps={processSteps} />
        </div>
      </Container>
    </section>
  )
}
