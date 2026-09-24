import { describe, expect, it } from 'vitest'
import { fragmentShader } from '@/components/intro/aperture/engine'
import {
  INTRO_BOOT_SCRIPT,
  INTRO_DURATION,
  INTRO_STORAGE_KEY,
  INTRO_TEXT_Y,
  fitShaderFrame,
  introFrameHeight,
  introOverlay,
  introSceneTime,
} from '@/lib/intro'

describe('introSceneTime', () => {
  it('skips the opening darkness of the original scene', () => {
    expect(introSceneTime(0)).toBeGreaterThan(0)
  })

  it('plays faster than real time and stops at the end of the scene', () => {
    expect(introSceneTime(1) - introSceneTime(0)).toBeGreaterThan(1)
    expect(introSceneTime(INTRO_DURATION + 10)).toBeCloseTo(introSceneTime(INTRO_DURATION))
  })

  it('lasts about ten seconds', () => {
    expect(INTRO_DURATION).toBeGreaterThan(8)
    expect(INTRO_DURATION).toBeLessThan(11)
  })
})

describe('introOverlay', () => {
  it('keeps the wordmark dark until the glass rim appears', () => {
    expect(introOverlay(8).text).toBe(0)
  })

  it('lights the wordmark while the rim glows', () => {
    expect(introOverlay(11)).toEqual({ text: 1, opacity: 1 })
  })

  it('fades the overlay out at the end', () => {
    expect(introOverlay(introSceneTime(INTRO_DURATION)).opacity).toBe(0)
  })

  it('never decreases the text reveal', () => {
    let previous = 0
    for (let t = 0; t <= INTRO_DURATION; t += 0.1) {
      const { text } = introOverlay(introSceneTime(t))
      expect(text).toBeGreaterThanOrEqual(previous)
      previous = text
    }
  })
})

describe('introFrameHeight', () => {
  it('keeps the 16:9 scene fully visible on a desktop screen', () => {
    expect(introFrameHeight(1440, 900)).toBe(810)
  })

  it('zooms in on portrait phones instead of shrinking the scene to a strip', () => {
    expect(introFrameHeight(390, 844)).toBeGreaterThan(390 * (9 / 16) * 2)
    expect(introFrameHeight(390, 844)).toBeLessThanOrEqual(844)
  })
})

describe('fitShaderFrame', () => {
  it('replaces the fixed 16:9 letterbox with a uniform-driven, unclipped frame', () => {
    const fitted = fitShaderFrame(fragmentShader)
    expect(fitted).toContain('uniform float uFrameHeight;')
    expect(fitted).toContain('frame.y=uFrameHeight;')
    expect(fitted).not.toContain('min(uResolution.x,uResolution.y*16.0/9.0)')
    expect(fitted).toContain('float inside=1.0;')
  })

  it('throws when the shader no longer has the expected frame code', () => {
    expect(() => fitShaderFrame('void main() {}')).toThrow()
  })
})

describe('INTRO_TEXT_Y', () => {
  it('sits between the light source and the glass rim', () => {
    expect(INTRO_TEXT_Y).toBeGreaterThan(0.5)
    expect(INTRO_TEXT_Y).toBeLessThan(0.77)
  })
})

describe('INTRO_BOOT_SCRIPT', () => {
  it('checks the same session key the component writes', () => {
    expect(INTRO_BOOT_SCRIPT).toContain(INTRO_STORAGE_KEY)
    expect(INTRO_BOOT_SCRIPT).toContain('prefers-reduced-motion: reduce')
  })

  it('requires WebGL 2, which the scene shader needs', () => {
    expect(INTRO_BOOT_SCRIPT).toContain("getContext('webgl2')")
  })

  it('never throws, even without sessionStorage', () => {
    expect(() => new Function(INTRO_BOOT_SCRIPT)()).not.toThrow()
  })
})
