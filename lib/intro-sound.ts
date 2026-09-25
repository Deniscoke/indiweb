// The score of the intro's ambient soundtrack: how loud, how bright and how much
// shimmer at each moment, following the light on screen. The Web Audio graph in
// components/intro/intro-sound.ts plays it.
import { INTRO_DURATION, introElapsed } from '@/lib/intro'

export type IntroSoundScore = {
  /** Overall loudness, 0–1. */
  level: number
  /** How far the pad's filter has opened, 0 (muffled) – 1 (clear). */
  brightness: number
  /** The high glassy notes that arrive with the wordmark, 0–1. */
  shimmer: number
}

/** The wordmark lights up between these scene times (see introOverlay). */
const BLOOM_START = introElapsed(8.6)
const BLOOM_END = introElapsed(9.8)
/** The overlay starts fading out here. */
const FADE_START = introElapsed(12.6)

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function smoothstep(from: number, to: number, t: number) {
  const x = clamp01((t - from) / (to - from))
  return x * x * (3 - 2 * x)
}

/**
 * The soundtrack at a given number of seconds into the intro: a pad that swells
 * in from silence and opens up as the light does, blooms with the wordmark, and
 * is still half-sounding when the intro closes, so it can ring out into the site.
 */
export function introSoundScore(elapsed: number): IntroSoundScore {
  const bloom = smoothstep(BLOOM_START - 0.8, BLOOM_END, elapsed)
  const swell = smoothstep(0, 2.8, elapsed)
  const fade = 1 - 0.5 * smoothstep(FADE_START, INTRO_DURATION, elapsed)
  return {
    level: clamp01(swell * (0.72 + 0.28 * bloom) * fade),
    brightness: clamp01(smoothstep(0, BLOOM_END, elapsed) ** 1.4),
    shimmer: smoothstep(BLOOM_START - 0.3, BLOOM_END + 0.4, elapsed),
  }
}
