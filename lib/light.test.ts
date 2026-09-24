import { describe, expect, it } from 'vitest'
import { driftTarget, lightIntensity, stepLight, type LightState } from '@/lib/light'

describe('stepLight', () => {
  it('glides towards the pointer and settles there', () => {
    let state: LightState = { x: 0, y: 0, vx: 0, vy: 0 }
    for (let i = 0; i < 180; i++) state = stepLight(state, 500, 300, 1 / 60)
    expect(state.x).toBeCloseTo(500, 0)
    expect(state.y).toBeCloseTo(300, 0)
  })

  it('lags behind a sudden move instead of jumping', () => {
    const state = stepLight({ x: 0, y: 0, vx: 0, vy: 0 }, 500, 0, 1 / 60)
    expect(state.x).toBeGreaterThan(0)
    expect(state.x).toBeLessThan(100)
  })

  it('barely overshoots, like a heavy object', () => {
    let state: LightState = { x: 0, y: 0, vx: 0, vy: 0 }
    let furthest = 0
    for (let i = 0; i < 240; i++) {
      state = stepLight(state, 500, 0, 1 / 60)
      furthest = Math.max(furthest, state.x)
    }
    expect(furthest).toBeLessThan(520)
  })

  it('stays stable after a long pause between frames', () => {
    const state = stepLight({ x: 0, y: 0, vx: 0, vy: 0 }, 500, 0, 2)
    expect(Number.isFinite(state.x)).toBe(true)
    expect(Math.abs(state.x)).toBeLessThan(600)
  })
})

describe('lightIntensity', () => {
  it('shines fully at the top of the page', () => {
    expect(lightIntensity(0, 900)).toBe(1)
  })

  it('dims below the hero so text stays readable', () => {
    expect(lightIntensity(5000, 900)).toBeCloseTo(0.4)
    expect(lightIntensity(450, 900)).toBeGreaterThan(0.4)
    expect(lightIntensity(450, 900)).toBeLessThan(1)
  })
})

describe('driftTarget', () => {
  it('wanders within the upper right of the hero', () => {
    for (let t = 0; t < 120; t += 0.7) {
      const { x, y } = driftTarget(t, 390, 844)
      expect(x).toBeGreaterThan(390 * 0.35)
      expect(x).toBeLessThan(390 * 0.9)
      expect(y).toBeGreaterThan(844 * 0.15)
      expect(y).toBeLessThan(844 * 0.45)
    }
  })
})
