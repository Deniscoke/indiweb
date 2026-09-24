'use client'

import { useEffect, useRef } from 'react'
import { INTRO_DURATION, INTRO_TEXT_Y, introFrame, markIntroSeen } from '@/lib/intro'

const SKIP_FADE_MS = 400
const MAX_PIXEL_RATIO = 1.5

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`

// Coordinates are in screen-height units with the origin at the centre, y up.
const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uResolution;
uniform float uFlare;
uniform float uFlareSize;
uniform float uSourceY;
uniform float uBeam;
uniform float uRim;
uniform float uTextY;

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 d = p - vec2(0.0, uSourceY);
  float r = length(d);

  // Opening flare: soft bloom, bright core and a few faint rays.
  float bloom = exp(-r * r / (uFlareSize * uFlareSize + 0.0001));
  float angle = atan(d.y, d.x);
  float rays = pow(abs(sin(angle * 6.0)), 24.0) * exp(-r * 3.0) * 0.25
             + pow(abs(sin(angle * 11.0 + 0.7)), 40.0) * exp(-r * 4.0) * 0.15;
  float core = 0.002 / (r * r + 0.002);
  vec3 color = vec3(0.86, 0.9, 1.0) * uFlare * (bloom * 1.6 + rays);
  color += vec3(1.0) * core * max(uFlare, uBeam) * 0.6;

  // Beam falling from the source onto the wordmark, widening as it goes.
  float span = max(uSourceY - uTextY, 0.001);
  float along = clamp((uSourceY - p.y) / span, 0.0, 1.2);
  float inside = step(p.y, uSourceY) * smoothstep(uTextY - 0.04, uTextY + 0.04, p.y);
  float width = mix(0.003, 0.05, along);
  float beamCore = exp(-p.x * p.x / (width * width)) * (0.35 + 0.65 * (1.0 - along * 0.6));
  float haze = exp(-p.x * p.x / (width * width * 16.0)) * 0.18;
  color += vec3(0.78, 0.84, 1.0) * uBeam * inside * (beamCore + haze);

  // Pool of light where the beam lands.
  vec2 q = p - vec2(0.0, uTextY);
  color += vec3(0.7, 0.76, 1.0) * uBeam * 0.25 * exp(-(q.x * q.x * 6.0 + q.y * q.y * 40.0));

  // Thin curved glass rim under the wordmark.
  float rimY = uTextY - 0.1 + 0.35 * p.x * p.x;
  float rimLine = exp(-pow((p.y - rimY) * 220.0, 2.0)) * exp(-p.x * p.x * 9.0);
  color += vec3(0.8, 0.78, 1.0) * uRim * rimLine * 1.4;

  gl_FragColor = vec4(1.0 - exp(-color * 1.3), 1.0);
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

export function IntroCinematic() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const skipRef = useRef<() => void>(() => {})

  useEffect(() => {
    const html = document.documentElement
    const root = rootRef.current
    const canvas = canvasRef.current
    const wordmark = wordmarkRef.current
    if (html.dataset.intro !== 'play' || !root || !canvas || !wordmark) return

    let frameId = 0
    let fadeTimer = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(frameId)
      markIntroSeen()
      delete html.dataset.intro
    }

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    const program = gl && createProgram(gl)
    if (!gl || !program) {
      finish()
      return
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      resolution: uniform('uResolution'),
      flare: uniform('uFlare'),
      flareSize: uniform('uFlareSize'),
      sourceY: uniform('uSourceY'),
      beam: uniform('uBeam'),
      rim: uniform('uRim'),
      textY: uniform('uTextY'),
    }
    gl.uniform1f(u.textY, INTRO_TEXT_Y)

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      canvas.width = Math.round(window.innerWidth * ratio)
      canvas.height = Math.round(window.innerHeight * ratio)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    const render = (now: number) => {
      const t = (now - start) / 1000
      const frame = introFrame(t)
      gl.uniform1f(u.flare, frame.flare)
      gl.uniform1f(u.flareSize, frame.flareSize)
      gl.uniform1f(u.sourceY, frame.sourceY)
      gl.uniform1f(u.beam, frame.beam)
      gl.uniform1f(u.rim, frame.rim)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      wordmark.style.setProperty('--lit', String(frame.text))
      root.style.opacity = String(frame.opacity)
      if (t >= INTRO_DURATION) finish()
      else frameId = requestAnimationFrame(render)
    }
    frameId = requestAnimationFrame(render)

    let skipping = false
    skipRef.current = () => {
      if (finished || skipping) return
      skipping = true
      cancelAnimationFrame(frameId)
      root.style.transition = `opacity ${SKIP_FADE_MS}ms ease`
      root.style.opacity = '0'
      fadeTimer = window.setTimeout(finish, SKIP_FADE_MS)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skipRef.current()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(fadeTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div ref={rootRef} className="intro" onClick={() => skipRef.current()}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <p ref={wordmarkRef} aria-hidden="true" className="intro-wordmark font-display">
        <span className="intro-wordmark__text">IndiWeb</span>
      </p>
      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute right-6 bottom-6 rounded-full border border-line-strong px-5 py-2.5 text-sm text-fg-dim transition-colors hover:text-fg"
      >
        Přeskočit intro
      </button>
    </div>
  )
}
