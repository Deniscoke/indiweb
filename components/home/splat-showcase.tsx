'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/components/i18n/i18n-provider'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { splatScene } from '@/content/splat'
import { gsap, useScene } from '@/lib/motion'

/** Starts loading the embed this far ahead, so it is ready by the time it is seen. */
const PRELOAD_MARGIN = '600px 0px'

export function SplatShowcase() {
  const t = useI18n().dict.splat
  const ref = useRef<HTMLElement>(null)
  // The embed pulls in over 1 MB of Splatoo's viewer, so it waits until the
  // visitor nears it (browsers without IntersectionObserver load it at once).
  const [near, setNear] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))

  useEffect(() => {
    const frame = ref.current?.querySelector('[data-portal]')
    if (near || !frame) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: PRELOAD_MARGIN },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [near])

  // A portal into the room: on desktop the scene opens from a small rounded
  // window to the full frame as it scrolls into view. Phones get a rise-in.
  useScene(ref, ({ desktop }) => {
    if (!desktop) {
      gsap.from('[data-portal]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-portal]', start: 'top 88%' },
      })
      return
    }
    gsap.fromTo(
      '[data-portal]',
      { clipPath: 'inset(16% 24% round 32px)', scale: 0.94 },
      {
        clipPath: 'inset(0% 0% round 0px)',
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-portal]', start: 'top 92%', end: 'center 55%', scrub: 1 },
      },
    )
  })

  return (
    <section ref={ref} id="splaty" aria-labelledby="splaty-nadpis" className="pt-8 pb-20 sm:pt-12 sm:pb-40">
      <Container>
        <p className="mb-6 font-mono text-xs text-accent">{t.eyebrow}</p>
        <SectionHeading id="splaty-nadpis" title={t.title} lead={t.lead} />

        <div
          data-portal
          className="splat-frame relative mt-12 aspect-[4/5] overflow-hidden border border-line-strong bg-bg-soft sm:mt-20 sm:aspect-video"
        >
          {near ? (
            <iframe
              src={splatScene.embedUrl}
              title={t.sceneTitle}
              loading="lazy"
              allow="fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <p className="absolute inset-0 grid place-items-center font-mono text-xs text-fg-faint">
              {t.loading}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <BulletList items={t.collaboration} />
          <ButtonLink href={splatScene.url} external variant="ghost" withArrow>
            {t.open}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
