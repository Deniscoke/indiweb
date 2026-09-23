'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/container'
import { contactHref, navigation, site } from '@/content/site'
import { cn } from '@/lib/cn'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)
  const solid = scrolled || open

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        solid ? 'border-line bg-bg/80 backdrop-blur-xl' : 'border-transparent',
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-fg shadow-[0_0_14px_1px_rgb(255_255_255/0.7)]"
          />
          {site.name}
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-fg-dim">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={contactHref}
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent-strong sm:inline-flex"
          >
            Napište nám
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobilni-menu"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg md:hidden"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobilni-menu" aria-label="Mobilní navigace" className="border-t border-line md:hidden">
          <Container>
            <ul className="flex flex-col py-4">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="block py-3 text-lg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
