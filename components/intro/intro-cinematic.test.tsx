// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IntroCinematic } from '@/components/intro/intro-cinematic'
import { INTRO_STORAGE_KEY } from '@/lib/intro'

// Minimal WebGL stand-in: every method is a no-op, compile/link checks succeed.
function fakeWebGL() {
  return new Proxy(
    {},
    {
      get: (_, key) => {
        if (key === 'getShaderParameter' || key === 'getProgramParameter') return () => true
        if (typeof key === 'string' && key === key.toUpperCase()) return 1
        return () => ({})
      },
    },
  )
}

const html = document.documentElement

beforeEach(() => {
  sessionStorage.clear()
  delete html.dataset.intro
})

afterEach(() => {
  vi.restoreAllMocks()
  delete html.dataset.intro
})

describe('IntroCinematic', () => {
  it('does nothing when the boot script decided not to play', () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
    render(<IntroCinematic />)
    expect(getContext).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull()
  })

  it('finishes at once when WebGL is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    expect(html.dataset.intro).toBeUndefined()
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped with the button and remembers it for the session', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fakeWebGL() as never)
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    expect(html.dataset.intro).toBe('play')

    fireEvent.click(screen.getByRole('button', { name: 'Přeskočit intro' }))
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped with Escape', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fakeWebGL() as never)
    html.dataset.intro = 'play'
    render(<IntroCinematic />)
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(html.dataset.intro).toBeUndefined())
  })

  it('hides the decorative canvas and wordmark from screen readers', () => {
    const { container } = render(<IntroCinematic />)
    expect(container.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('IndiWeb').closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
