// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createRenderer, createSound, sound } = vi.hoisted(() => {
  const sound = { update: vi.fn(), release: vi.fn() }
  return { createRenderer: vi.fn(), createSound: vi.fn(() => sound), sound }
})

// jsdom has no Web Audio: the soundtrack is replaced by a spy.
vi.mock('@/components/intro/intro-sound', () => ({ createIntroSound: createSound }))

// jsdom has no WebGL: stand in for the few three.js classes the intro uses.
vi.mock('three', () => ({
  WebGLRenderer: vi.fn(function () {
    return createRenderer()
  }),
  Vector2: vi.fn(class {}),
  ShaderMaterial: vi.fn(
    class {
      dispose() {}
    },
  ),
  PlaneGeometry: vi.fn(
    class {
      dispose() {}
    },
  ),
  Mesh: vi.fn(
    class {
      frustumCulled = true
    },
  ),
  Scene: vi.fn(
    class {
      add() {}
    },
  ),
  Camera: vi.fn(class {}),
}))

import { IntroCinematic } from '@/components/intro/intro-cinematic'
import { INTRO_STORAGE_KEY } from '@/lib/intro'

function workingRenderer() {
  return {
    domElement: document.createElement('canvas'),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    getDrawingBufferSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  }
}

const html = document.documentElement

beforeEach(() => {
  sessionStorage.clear()
  delete html.dataset.intro
  createRenderer.mockImplementation(workingRenderer)
  createRenderer.mockClear()
  createSound.mockClear()
  sound.update.mockClear()
  sound.release.mockClear()
})

afterEach(() => {
  delete html.dataset.intro
})

const enterButton = () => screen.getByRole('button', { name: 'Vstoupit' })

describe('IntroCinematic', () => {
  it('does nothing when the boot script decided not to play', async () => {
    render(<IntroCinematic />)
    fireEvent.click(enterButton())
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(createRenderer).not.toHaveBeenCalled()
    expect(createSound).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull()
  })

  it('waits at the entrance, with the focus on the way in', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(createRenderer).not.toHaveBeenCalled()
    expect(createSound).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(enterButton())
  })

  it('starts the light scene and its soundtrack together on entering', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.click(enterButton())
    expect(createSound).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(createRenderer).toHaveBeenCalledTimes(1))
    expect(html.dataset.intro).toBe('play')
    expect(document.querySelector('.intro-scene canvas')).not.toBeNull()
  })

  it('enters on a click anywhere at the entrance, and only once', async () => {
    html.dataset.intro = 'play'
    const { container } = render(<IntroCinematic />)
    fireEvent.click(container.querySelector('.intro')!)
    fireEvent.click(enterButton())
    await waitFor(() => expect(createRenderer).toHaveBeenCalledTimes(1))
    expect(createSound).toHaveBeenCalledTimes(1)
    expect(html.dataset.intro).toBe('play')
  })

  it('lets the visitor into the site when WebGL fails', async () => {
    createRenderer.mockImplementation(() => {
      throw new Error('WebGL 2 unavailable')
    })
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.click(enterButton())
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
    expect(sound.release).toHaveBeenCalled()
  })

  it('can be skipped with the button, silencing the sound, and remembers it for the session', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.click(enterButton())
    await waitFor(() => expect(createRenderer).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    expect(sound.release).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped straight from the entrance, without any sound', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(createSound).not.toHaveBeenCalled()
  })

  it('can be skipped with Escape, even while the scene is still loading', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.click(enterButton())
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
  })

  it('hides the decorative scene and wordmark from screen readers', () => {
    const { container } = render(<IntroCinematic />)
    expect(container.querySelector('.intro-scene')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('IndiWeb').closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
