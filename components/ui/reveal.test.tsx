// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { Reveal } from '@/components/ui/reveal'

it('shows content right away when IntersectionObserver is missing', () => {
  render(
    <Reveal>
      <p>Obsah</p>
    </Reveal>,
  )
  expect(screen.getByText('Obsah').parentElement?.classList.contains('is-visible')).toBe(true)
})

it('reveals content once it scrolls into view', () => {
  const observers: Array<{ callback: IntersectionObserverCallback }> = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        observers.push(this)
      }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    },
  )

  render(
    <Reveal>
      <p>Obsah</p>
    </Reveal>,
  )
  const wrapper = screen.getByText('Obsah').parentElement as HTMLElement
  expect(wrapper.classList.contains('is-visible')).toBe(false)

  act(() => {
    observers[0].callback(
      [{ isIntersecting: true, target: wrapper } as unknown as IntersectionObserverEntry],
      observers[0] as unknown as IntersectionObserver,
    )
  })
  expect(wrapper.classList.contains('is-visible')).toBe(true)
})
