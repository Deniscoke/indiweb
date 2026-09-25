import { describe, expect, it } from 'vitest'
import { INTRO_DURATION, introElapsed } from '@/lib/intro'
import { introSoundScore } from '@/lib/intro-sound'

const samples = Array.from({ length: 200 }, (_, index) => (index / 199) * INTRO_DURATION)
const bloomEnd = introElapsed(9.8)

describe('introSoundScore', () => {
  it('starts in silence and swells in gently', () => {
    expect(introSoundScore(0).level).toBe(0)
    expect(introSoundScore(0.5).level).toBeLessThan(0.2)
    expect(introSoundScore(3).level).toBeGreaterThan(0.5)
  })

  it('peaks when the wordmark lights up, then fades towards the end', () => {
    const peak = introSoundScore(bloomEnd).level
    expect(peak).toBeGreaterThan(introSoundScore(3).level)
    expect(introSoundScore(INTRO_DURATION).level).toBeLessThan(peak * 0.7)
  })

  it('opens up like the light: brightness only ever grows until the bloom', () => {
    const upToBloom = samples.filter((t) => t <= bloomEnd).map((t) => introSoundScore(t).brightness)
    for (let i = 1; i < upToBloom.length; i++) expect(upToBloom[i]).toBeGreaterThanOrEqual(upToBloom[i - 1])
    expect(introSoundScore(0).brightness).toBe(0)
    expect(introSoundScore(bloomEnd).brightness).toBeCloseTo(1)
  })

  it('adds the shimmer only when the wordmark lights up', () => {
    expect(introSoundScore(3).shimmer).toBe(0)
    expect(introSoundScore(bloomEnd + 0.5).shimmer).toBe(1)
  })

  it('keeps every value between 0 and 1', () => {
    for (const t of [-1, ...samples, INTRO_DURATION + 5]) {
      for (const value of Object.values(introSoundScore(t))) {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(1)
      }
    }
  })
})
