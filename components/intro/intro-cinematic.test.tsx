// @vitest-environment jsdom
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '@/test/render'

const { createRenderer, createSound, sound, push } = vi.hoisted(() => {
  const sound = { update: vi.fn(), release: vi.fn() }
  return { createRenderer: vi.fn(), createSound: vi.fn(() => sound), sound, push: vi.fn() }
})

const router = { push, prefetch: vi.fn() }
vi.mock('next/navigation', () => ({ useRouter: () => router }))

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
import { carryIntro, introIsCarried, takeCarriedIntro } from '@/components/intro/intro-handover'
import { introGate } from '@/content/locales'
import { LOCALES, type Locale } from '@/lib/i18n'
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
  push.mockClear()
  takeCarriedIntro()
  window.history.replaceState(null, '', '/')
})

afterEach(() => {
  delete html.dataset.intro
})

const intro = (locale: Locale = 'cs') => renderWithI18n(<IntroCinematic gate={introGate()} />, locale)
/** The lens of one language at the entrance. */
const lens = (locale: Locale = 'cs') => document.querySelector<HTMLButtonElement>(`[data-lens][lang="${locale}"]`)!
const enterButton = () => lens()

describe('IntroCinematic', () => {
  it('does nothing when the boot script decided not to play', async () => {
    intro()
    fireEvent.click(enterButton())
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(createRenderer).not.toHaveBeenCalled()
    expect(createSound).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull()
  })

  it('waits at the entrance, with the focus on the way in', async () => {
    html.dataset.intro = 'play'
    intro()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(createRenderer).not.toHaveBeenCalled()
    expect(createSound).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(enterButton())
  })

  it('starts the light scene and its soundtrack together on entering', async () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(enterButton())
    expect(createSound).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(createRenderer).toHaveBeenCalledTimes(1))
    expect(html.dataset.intro).toBe('play')
    expect(document.querySelector('.intro-scene canvas')).not.toBeNull()
  })

  it('enters on a click anywhere at the entrance, and only once', async () => {
    html.dataset.intro = 'play'
    const { container } = intro()
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
    intro()
    fireEvent.click(enterButton())
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
    expect(sound.release).toHaveBeenCalled()
  })

  it('can be skipped with the button, silencing the sound, and remembers it for the session', async () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(enterButton())
    await waitFor(() => expect(createRenderer).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    expect(sound.release).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped straight from the entrance, without any sound', async () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(createSound).not.toHaveBeenCalled()
  })

  it('can be skipped with Escape, even while the scene is still loading', async () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(enterButton())
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
  })

  it('offers a way in for every language, each named in its own language', () => {
    intro()
    for (const { locale, name, enter } of introGate()) {
      expect(lens(locale).textContent).toContain(name)
      expect(lens(locale).getAttribute('aria-label')).toContain(enter)
    }
    expect(document.querySelectorAll('[data-lens]')).toHaveLength(LOCALES.length)
  })

  it('suggests the language of the page behind the gate', async () => {
    html.dataset.intro = 'play'
    intro('de')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(document.activeElement).toBe(lens('de'))
  })

  it('stays on the page when its own language is chosen', () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(lens('cs'))
    expect(push).not.toHaveBeenCalled()
    expect(createSound).toHaveBeenCalledTimes(1)
  })

  it('flies through the lens of another language, then opens the same page in it', async () => {
    html.dataset.intro = 'play'
    window.history.replaceState(null, '', '/projekty/elevator-servis')
    intro()
    fireEvent.click(lens('en'))
    // The click is what unlocks the sound; the picture waits for the new page.
    expect(createSound).toHaveBeenCalledTimes(1)
    expect(push).not.toHaveBeenCalled()
    await waitFor(() => expect(push).toHaveBeenCalledWith('/en/projects/elevator-servis'), { timeout: 2000 })
    expect(createRenderer).not.toHaveBeenCalled()
    expect(introIsCarried()).toBe(true)
  })

  it('starts at once, with the carried sound, on a page reached through the entrance', async () => {
    carryIntro(sound)
    intro('en')
    await waitFor(() => expect(createRenderer).toHaveBeenCalledTimes(1))
    expect(html.dataset.intro).toBe('play')
    expect(createSound).not.toHaveBeenCalled()
    expect(document.querySelector('.intro-gate')?.hasAttribute('inert')).toBe(true)
    expect(introIsCarried()).toBe(false)
  })

  it('opens the other language without an intro when it was skipped on the way', async () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(lens('de'))
    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/de'), { timeout: 2000 })
    expect(introIsCarried()).toBe(false)
    expect(sound.release).toHaveBeenCalled()
  })

  it('takes one choice only: the other lenses go dark', () => {
    html.dataset.intro = 'play'
    intro()
    fireEvent.click(lens('de'))
    fireEvent.click(lens('en'))
    expect(createSound).toHaveBeenCalledTimes(1)
    expect(lens('de').hasAttribute('data-chosen')).toBe(true)
    expect(document.querySelector('.intro-gate')?.hasAttribute('inert')).toBe(true)
  })

  it('hides the decorative scene and wordmark from screen readers', () => {
    const { container } = intro()
    expect(container.querySelector('.intro-scene')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('IndiWeb').closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
