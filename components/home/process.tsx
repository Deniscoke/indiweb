'use client'

import { useRef } from 'react'
import { useI18n } from '@/components/i18n/i18n-provider'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { fitsInView, gsap, useScene } from '@/lib/motion'

export function Process() {
  const t = useI18n().dict.process
  const ref = useRef<HTMLElement>(null)

  // Scene 5 — the road from first message to launch: on desktop the section pins
  // and the steps travel sideways past a line of light that grows with the
  // journey, each step brightening as it reaches the middle. Phones keep the
  // vertical list with a rise-in per step.
  useScene(ref, ({ desktop }) => {
    const steps = gsap.utils.toArray<HTMLElement>('[data-track] li')

    const riseIn = () => {
      for (const step of steps) {
        gsap.from(step, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 88%' },
        })
      }
    }
    const list = ref.current?.querySelector<HTMLElement>('[data-track] ol')
    const track = ref.current?.querySelector<HTMLElement>('[data-track]')
    if (!desktop || !list || !track) return riseIn()

    track.setAttribute('data-staged', '')
    // Heading and road are pinned together and must fit below the header; a
    // longer heading (German, on a small laptop) leaves the steps in a column.
    if (!fitsInView(track.parentElement, 88)) {
      track.removeAttribute('data-staged')
      return riseIn()
    }
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
    // Reverting the scene does not remove an attribute it set.
    return () => track.removeAttribute('data-staged')
  })

  return (
    <section ref={ref} id="postup" aria-labelledby="postup-nadpis" className="overflow-x-clip py-20 sm:py-40">
      <Container>
        <SectionHeading id="postup-nadpis" title={t.title} />
        <div data-track className="process-track relative mt-12 sm:mt-20">
          <span aria-hidden="true" data-process-line className="process-line" />
          <StepList steps={t.steps} />
        </div>
      </Container>
    </section>
  )
}
