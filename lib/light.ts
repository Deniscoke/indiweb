// Motion of the page light: a heavy light source that glides after the
// pointer (a damped spring), dims below the hero, and drifts on its own on
// touch screens. The shader in components/light/pointer-light.tsx draws it.

export type LightState = { x: number; y: number; vx: number; vy: number }

const STIFFNESS = 55
// Slightly under critical damping: a hint of weight without visible wobble.
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.92
const MAX_STEP = 1 / 30

/** Advances the light towards the target (CSS pixels) by dt seconds. */
export function stepLight(state: LightState, targetX: number, targetY: number, dt: number): LightState {
  let { x, y, vx, vy } = state
  // Long gaps (tab switches) are integrated in small steps to stay stable.
  let remaining = Math.min(dt, 0.5)
  while (remaining > 0) {
    const step = Math.min(remaining, MAX_STEP)
    vx += (STIFFNESS * (targetX - x) - DAMPING * vx) * step
    vy += (STIFFNESS * (targetY - y) - DAMPING * vy) * step
    x += vx * step
    y += vy * step
    remaining -= step
  }
  return { x, y, vx, vy }
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Brightness of the light: full over the hero, dimmed further down the page. */
export function lightIntensity(scrollY: number, viewportHeight: number): number {
  const t = clamp01(scrollY / (viewportHeight * 0.9))
  const eased = t * t * (3 - 2 * t)
  return 1 - 0.6 * eased
}

/** Where the light wanders on its own (no pointer): a slow loop over the hero's upper right. */
export function driftTarget(time: number, width: number, height: number): { x: number; y: number } {
  return {
    x: width * (0.62 + 0.2 * Math.sin(time * 0.21) * Math.cos(time * 0.07)),
    y: height * (0.3 + 0.1 * Math.sin(time * 0.29 + 1)),
  }
}
