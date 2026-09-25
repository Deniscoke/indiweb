'use client'

import { Fragment, useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { gsap, useScene } from '@/lib/motion'

export type ShardPath = { angle: number; distance: number; length: number }

const GOLDEN_ANGLE = 137.508

/**
 * Where each shard of light flies: angles walk the golden angle so they cover
 * the whole circle evenly, distances (vmin) and lengths (px) vary without
 * randomness, so the server and the browser render the same thing.
 */
export function shardPaths(count: number): ShardPath[] {
  return Array.from({ length: count }, (_, index) => ({
    angle: (index * GOLDEN_ANGLE) % 360,
    distance: 28 + ((index * 37) % 30),
    length: 40 + ((index * 53) % 90),
  }))
}

const SHARDS = shardPaths(14)

/** Scatter of a character before it assembles, deterministic per index. */
function scatter(index: number) {
  const angle = (index * GOLDEN_ANGLE * Math.PI) / 180
  return { x: Math.cos(angle) * 180, y: Math.sin(angle) * 120, rotate: ((index * 47) % 120) - 60 }
}

type FinaleHeadingProps = { id: string; text: string; className?: string }

/**
 * The closing line of the story. On desktop its letters fly together out of the
 * dark as it scrolls in while shards of light burst away from it; on phones the
 * letters simply rise in. Screen readers get the plain sentence.
 */
export function FinaleHeading({ id, text, className }: FinaleHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useScene(ref, ({ desktop }) => {
    const chars = gsap.utils.toArray<HTMLElement>('[data-char]')

    if (!desktop) {
      gsap.from(chars, {
        yPercent: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
      return
    }

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'top 35%', scrub: 1 },
    })
    chars.forEach((char, index) => {
      const { x, y, rotate } = scatter(index)
      timeline.fromTo(
        char,
        { x, y, rotate, scale: 0.4, opacity: 0 },
        { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'power3.out', duration: 0.7 },
        index * 0.03,
      )
    })
    gsap.utils.toArray<HTMLElement>('[data-shard]').forEach((shard, index) => {
      const { angle, distance } = SHARDS[index]
      const radians = (angle * Math.PI) / 180
      const reach = (distance * Math.min(window.innerWidth, window.innerHeight)) / 100
      timeline.fromTo(
        shard,
        { x: 0, y: 0, rotate: angle, scaleX: 0.2, opacity: 0 },
        {
          keyframes: [
            { opacity: 1, scaleX: 1, duration: 0.15 },
            { x: Math.cos(radians) * reach, y: Math.sin(radians) * reach, opacity: 0, duration: 0.55 },
          ],
          ease: 'power2.out',
        },
        0.35 + (index % 5) * 0.04,
      )
    })
  })

  const words = text.split(' ')

  return (
    <h2 ref={ref} id={id} className={cn('relative', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          // Spaces sit between the word boxes: inside an inline-block they would collapse.
          <Fragment key={`${word}-${wordIndex}`}>
            {wordIndex > 0 && ' '}
            <span data-word className="inline-block whitespace-nowrap">
              {[...word].map((char, charIndex) => (
                // The padding lets the lit background reach glyph parts outside the
                // advance box (the caron of "ď"); the negative margin keeps the spacing.
                <span key={charIndex} data-char className="lit -mx-[0.12em] -my-[0.1em] inline-block px-[0.12em] py-[0.1em]">
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
      <span aria-hidden="true" className="finale-shards">
        {SHARDS.map(({ length }, index) => (
          <span key={index} data-shard className="finale-shard" style={{ '--shard-length': `${length}px` } as CSSProperties} />
        ))}
      </span>
    </h2>
  )
}
