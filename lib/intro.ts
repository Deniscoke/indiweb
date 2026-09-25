// Timing and layout for the opening cinematic. The light scene itself is
// Filip Zrnzevic's "Aperture Light" (components/intro/aperture/engine.js);
// this module maps real time onto the scene and places the IndiWeb wordmark.

export const INTRO_STORAGE_KEY = 'indiweb-intro-seen'

/** Scene time (seconds of the original 14 s sequence) where the intro starts and ends. */
const SCENE_START = 1
const SCENE_END = 13.8
/** Playback speed relative to the original sequence. */
const SCENE_RATE = 1.3

/** Real length of the intro in seconds. */
export const INTRO_DURATION = (SCENE_END - SCENE_START) / SCENE_RATE

/** Vertical centre of the wordmark in scene units (0 = top, 1 = bottom), just above the glass rim. */
export const INTRO_TEXT_Y = 0.725
/** Wordmark font size as a fraction of the scene height. */
export const INTRO_FONT_SCALE = 0.1

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function smoothstep(from: number, to: number, t: number) {
  const x = clamp01((t - from) / (to - from))
  return x * x * (3 - 2 * x)
}

/** Maps seconds since the intro started to scene time. */
export function introSceneTime(elapsed: number): number {
  return Math.min(SCENE_END, SCENE_START + Math.max(0, elapsed) * SCENE_RATE)
}

/** The inverse: seconds since the intro started at which the scene reaches a given time. */
export function introElapsed(sceneTime: number): number {
  return (sceneTime - SCENE_START) / SCENE_RATE
}

/** Wordmark light (0–1) and overlay opacity (0–1) for a given scene time. */
export function introOverlay(sceneTime: number): { text: number; opacity: number } {
  return {
    // The glass rim lights up from 8 s; the wordmark follows it.
    text: smoothstep(8.6, 9.8, sceneTime),
    opacity: 1 - smoothstep(SCENE_END - 1.2, SCENE_END, sceneTime),
  }
}

/**
 * Height of the 16:9 scene frame in CSS pixels. Landscape screens show the
 * whole frame; portrait phones zoom in (cropping the sides) so the scene does
 * not shrink to a thin strip.
 */
export function introFrameHeight(width: number, height: number): number {
  const contain = Math.min(height, (width * 9) / 16)
  return Math.min(height, Math.max(contain, height * 0.62))
}

const LETTERBOX = 'float inside=step(abs(pixel.x),frame.x*.5)*step(abs(pixel.y),frame.y*.5);'

const FIXED_FRAME = `vec2 frame=vec2(min(uResolution.x,uResolution.y*16.0/9.0));
  frame.y=frame.x*9.0/16.0;`

/**
 * Makes the scene shader take its frame height from a uniform (see introFrameHeight)
 * and drops the letterbox, so the light can spill over the whole screen.
 */
export function fitShaderFrame(fragmentShader: string): string {
  if (
    !fragmentShader.includes(FIXED_FRAME) ||
    !fragmentShader.includes(LETTERBOX) ||
    !fragmentShader.includes('uniform vec2 uResolution;')
  ) {
    throw new Error('Aperture shader frame code not found; update fitShaderFrame.')
  }
  return fragmentShader
    .replace('uniform vec2 uResolution;', 'uniform vec2 uResolution;\nuniform float uFrameHeight;')
    .replace(FIXED_FRAME, 'vec2 frame;\n  frame.y=uFrameHeight;\n  frame.x=frame.y*16.0/9.0;')
    .replace(LETTERBOX, 'float inside=1.0;')
}

/**
 * Runs in <head> before the first paint: marks <html data-intro="play"> when the
 * intro should run, so the overlay never flashes for visitors who skip it.
 */
export const INTRO_BOOT_SCRIPT = `try{if(!sessionStorage.getItem(${JSON.stringify(
  INTRO_STORAGE_KEY,
)})&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&document.createElement('canvas').getContext('webgl2')){document.documentElement.dataset.intro='play'}}catch(e){}`

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
  } catch {
    // Storage can be blocked (private mode); the intro then just plays again next visit.
  }
}

/** Most pixels the intro shader renders per frame: phones get a smaller budget. */
const PIXEL_BUDGET = { fine: 3e6, coarse: 7e5 }

/** Device pixel ratio for the intro canvas, capped so the shader stays smooth. */
export function introPixelRatio(width: number, height: number, devicePixelRatio: number, coarsePointer: boolean): number {
  const budget = coarsePointer ? PIXEL_BUDGET.coarse : PIXEL_BUDGET.fine
  return Math.max(1, Math.min(2, devicePixelRatio || 1, Math.sqrt(budget / Math.max(1, width * height))))
}
