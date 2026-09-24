import { describe, expect, it } from 'vitest'
import { INTRO_BOOT_SCRIPT, INTRO_DURATION, INTRO_STORAGE_KEY, introFrame } from '@/lib/intro'

describe('introFrame', () => {
  it('starts in darkness with the overlay fully visible', () => {
    expect(introFrame(0)).toMatchObject({ flare: 0, beam: 0, text: 0, rim: 0, opacity: 1 })
  })

  it('peaks the flare before the beam appears', () => {
    const frame = introFrame(1.8)
    expect(frame.flare).toBeCloseTo(1)
    expect(frame.beam).toBe(0)
  })

  it('has the beam lighting up the wordmark and the rim at 4.5 s', () => {
    expect(introFrame(4.5)).toMatchObject({ flare: 0, beam: 1, text: 1, rim: 1, opacity: 1 })
  })

  it('moves the light source up while the flare contracts', () => {
    expect(introFrame(1).sourceY).toBeLessThan(introFrame(4).sourceY)
  })

  it('fades the overlay out by the end', () => {
    expect(introFrame(INTRO_DURATION).opacity).toBe(0)
    expect(introFrame(INTRO_DURATION + 5).opacity).toBe(0)
  })

  it('never decreases the text reveal', () => {
    let previous = 0
    for (let t = 0; t <= INTRO_DURATION; t += 0.1) {
      const { text } = introFrame(t)
      expect(text).toBeGreaterThanOrEqual(previous)
      previous = text
    }
  })

  it('keeps every value between 0 and 1', () => {
    for (let t = -1; t <= INTRO_DURATION + 1; t += 0.05) {
      for (const value of Object.values(introFrame(t))) {
        if (value === introFrame(t).sourceY) continue
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(1)
      }
    }
  })
})

describe('INTRO_BOOT_SCRIPT', () => {
  it('checks the same session key the component writes', () => {
    expect(INTRO_BOOT_SCRIPT).toContain(INTRO_STORAGE_KEY)
    expect(INTRO_BOOT_SCRIPT).toContain('prefers-reduced-motion: reduce')
  })

  it('never throws, even without sessionStorage', () => {
    expect(() => new Function(INTRO_BOOT_SCRIPT)()).not.toThrow()
  })
})
