// Timeline of the opening cinematic: a flare blooms, contracts into a beam
// that falls on the IndiWeb wordmark, then the overlay fades into the site.
// The shader and the wordmark both read their values from introFrame().

export const INTRO_DURATION = 6
export const INTRO_STORAGE_KEY = 'indiweb-intro-seen'

/** Vertical position (in screen-height units from the centre) where the beam lands. */
export const INTRO_TEXT_Y = -0.08

export type IntroFrame = {
  /** Brightness of the opening flare. */
  flare: number
  /** Radius of the flare's soft bloom. */
  flareSize: number
  /** Vertical position of the light source (screen-height units from the centre). */
  sourceY: number
  /** Brightness of the beam falling on the wordmark. */
  beam: number
  /** How far the wordmark is lit. */
  text: number
  /** Brightness of the glass rim under the wordmark. */
  rim: number
  /** Opacity of the whole overlay. */
  opacity: number
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function smoothstep(from: number, to: number, t: number) {
  const x = clamp01((t - from) / (to - from))
  return x * x * (3 - 2 * x)
}

export function introFrame(t: number): IntroFrame {
  const contraction = smoothstep(2.2, 3.2, t)
  return {
    flare: smoothstep(0.4, 1.4, t) * (1 - contraction),
    flareSize: 0.32 - 0.3 * contraction,
    sourceY: 0.05 + 0.33 * contraction,
    beam: smoothstep(2.4, 3.4, t),
    text: smoothstep(3.2, 4.2, t),
    rim: smoothstep(3.4, 4.4, t),
    opacity: 1 - smoothstep(5, INTRO_DURATION, t),
  }
}

/**
 * Runs in <head> before the first paint: marks <html data-intro="play"> when the
 * intro should run, so the overlay never flashes for visitors who skip it.
 */
export const INTRO_BOOT_SCRIPT = `try{if(!sessionStorage.getItem(${JSON.stringify(
  INTRO_STORAGE_KEY,
)})&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&document.createElement('canvas').getContext('webgl')){document.documentElement.dataset.intro='play'}}catch(e){}`

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
  } catch {
    // Storage can be blocked (private mode); the intro then just plays again next visit.
  }
}
