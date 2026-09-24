// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createRenderer } = vi.hoisted(() => ({ createRenderer: vi.fn() }))

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
})

afterEach(() => {
  delete html.dataset.intro
})

describe('IntroCinematic', () => {
  it('does nothing when the boot script decided not to play', async () => {
    render(<IntroCinematic />)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(createRenderer).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull()
  })

  it('starts the light scene when the boot script asked for it', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    await waitFor(() => expect(createRenderer).toHaveBeenCalledTimes(1))
    expect(html.dataset.intro).toBe('play')
    expect(document.querySelector('.intro-scene canvas')).not.toBeNull()
  })

  it('lets the visitor into the site when WebGL fails', async () => {
    createRenderer.mockImplementation(() => {
      throw new Error('WebGL 2 unavailable')
    })
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped with the button and remembers it for the session', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    await waitFor(() => expect(createRenderer).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped with Escape, even while the scene is still loading', async () => {
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
  })

  it('hides the decorative scene and wordmark from screen readers', () => {
    const { container } = render(<IntroCinematic />)
    expect(container.querySelector('.intro-scene')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('IndiWeb').closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
