'use client'

import { useEffect, useRef } from 'react'
import { driftTarget, lightIntensity, stepLight, type LightState } from '@/lib/light'
import { useReducedMotion } from '@/lib/use-reduced-motion'

// The light is soft, so it renders at half resolution and is scaled up.
const RENDER_SCALE = 0.5

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`

// A lens flare in the language of the intro: hot core, two-scale bloom, a
// spectral halo ring, faint rays, an anamorphic streak and lens ghosts that
// mirror the light through the centre of the screen, as in a real lens.
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 uResolution;
uniform vec2 uLight;
uniform vec2 uVelocity;
uniform float uIntensity;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float band(float x, float centre, float width) { float t = (x - centre) / width; return exp(-t * t); }

void main() {
  float unit = uResolution.y;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / unit;
  vec2 l = (uLight - 0.5 * uResolution) / unit;
  vec2 d = p - l;
  float r = length(d);
  float breathe = 0.93 + 0.05 * sin(uTime * 1.3) + 0.02 * sin(uTime * 7.1);

  // The hot core fades faster than the glow as the page scrolls, so text
  // further down stays readable while the ambience remains.
  float coreGain = uIntensity * uIntensity;
  vec3 c = vec3(0.0);
  c += vec3(1.0) * exp(-r * r / 0.0006) * 1.1 * coreGain;
  c += vec3(0.92, 0.93, 1.0) * exp(-r / 0.06) * 0.75 * coreGain;
  // Milky, volumetric bloom like the intro's flare.
  c += vec3(0.78, 0.8, 1.0) * exp(-r / 0.2) * 0.5;
  c += vec3(0.55, 0.5, 0.8) * exp(-r / 0.6) * 0.14;

  // Soft spectral halo.
  c.r += band(r, 0.265, 0.035) * 0.06;
  c.g += band(r, 0.250, 0.035) * 0.04;
  c.b += band(r, 0.235, 0.035) * 0.07;

  // A whisper of rays, not a starburst.
  float angle = atan(d.y, d.x);
  float rays = pow(abs(sin(angle * 7.0 + uTime * 0.05)), 40.0)
             + 0.6 * pow(abs(sin(angle * 13.0 - uTime * 0.03 + 1.3)), 60.0);
  rays *= 0.6 + 0.4 * hash(vec2(floor(angle * 40.0), 1.0));
  c += vec3(0.85, 0.87, 1.0) * rays * exp(-r * 6.0) * 0.06 * coreGain;

  float stretch = 0.35 + min(abs(uVelocity.x) / 2500.0, 0.6);
  c += vec3(0.75, 0.72, 1.0) * exp(-abs(d.y) / 0.0035) * exp(-abs(d.x) / stretch) * 0.16;

  vec2 g1 = -l * 0.45;
  vec2 g2 = -l * 0.9;
  vec2 g3 = -l * 1.35;
  c += vec3(0.55, 0.95, 0.85) * band(length(p - g1), 0.045, 0.005) * 0.10;
  c += vec3(0.35, 0.5, 1.0) * exp(-dot(p - g2, p - g2) / 0.0025) * 0.10;
  c += vec3(1.0, 0.55, 0.8) * exp(-dot(p - g3, p - g3) / 0.0006) * 0.08;

  c *= uIntensity * breathe;
  c = 1.0 - exp(-c * 1.25);
  c += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
  gl_FragColor = vec4(c, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null
}

/**
 * The page's light source. It glides after the pointer (or drifts on its own on
 * touch screens), is drawn with WebGL, and publishes its position as --mx/--my
 * so `.lit` text brightens exactly where the light is.
 */
export function PointerLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const html = document.documentElement
    const style = html.style

    let target = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.34 }
    let light: LightState = { ...target, vx: 0, vy: 0 }
    let followPointer = false
    let animated = false

    const publish = () => {
      style.setProperty('--mx', `${light.x}px`)
      style.setProperty('--my', `${light.y}px`)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      followPointer = true
      target = { x: event.clientX, y: event.clientY }
      // Without the animation loop (fallback or reduced motion) the light jumps straight there.
      if (!animated || reducedMotion) {
        light = { ...target, vx: 0, vy: 0 }
        publish()
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false })
    const program = gl && createProgram(gl)
    if (!gl || !program) {
      // Without WebGL a soft CSS glow stands in (see .page-light[data-fallback]).
      canvas.dataset.fallback = 'true'
      publish()
      return () => window.removeEventListener('pointermove', onPointerMove)
    }

    animated = true
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      resolution: uniform('uResolution'),
      light: uniform('uLight'),
      velocity: uniform('uVelocity'),
      intensity: uniform('uIntensity'),
      time: uniform('uTime'),
    }

    const resize = () => {
      canvas.width = Math.max(1, Math.round(window.innerWidth * RENDER_SCALE))
      canvas.height = Math.max(1, Math.round(window.innerHeight * RENDER_SCALE))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    let last = performance.now()
    const render = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const time = now / 1000
      if (!followPointer && !reducedMotion) {
        target = driftTarget(time, window.innerWidth, window.innerHeight)
      }
      if (!reducedMotion) light = stepLight(light, target.x, target.y, dt)
      publish()

      // The intro covers the page while it plays; no need to draw underneath.
      if (html.dataset.intro !== 'play') {
        gl.uniform2f(u.light, light.x * RENDER_SCALE, (window.innerHeight - light.y) * RENDER_SCALE)
        gl.uniform2f(u.velocity, light.vx, light.vy)
        gl.uniform1f(u.intensity, lightIntensity(window.scrollY, window.innerHeight))
        gl.uniform1f(u.time, reducedMotion ? 0 : time)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className="page-light" />
}
