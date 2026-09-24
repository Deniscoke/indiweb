'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/container'
import { contactHref, navigation, site } from '@/content/site'
import { cn } from '@/lib/cn'

// A 3×3 dot grid; when the menu opens only the diagonals stay lit, drawing an X.
const DOTS = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({ row, col })))

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block size-4">
      {DOTS.map(({ row, col }) => {
        const onDiagonal = row === col || row + col === 2
        return (
          <span
            key={`${row}-${col}`}
            className={cn(
              'absolute size-[3px] rounded-full bg-fg transition-all duration-500 ease-out',
              open && !onDiagonal && 'scale-0 opacity-0',
              open && onDiagonal && 'scale-125 shadow-[0_0_6px_rgb(217_184_255/0.8)]',
            )}
            style={{ left: `calc(${col * 50}% - 1.5px)`, top: `calc(${row * 50}% - 1.5px)` }}
          />
        )
      })}
    </span>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        scrolled && !open && 'bg-bg/70 backdrop-blur-xl',
      )}
    >
      <Container className="relative z-10 flex h-18 items-center justify-between gap-6">
        <Link href="/" onClick={close} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-white shadow-[0_0_12px_2px_rgb(255_255_255/0.75),0_0_28px_6px_rgb(217_184_255/0.35)]"
          />
          {site.name}
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href={contactHref}
            onClick={close}
            className="hidden text-sm text-fg-dim underline-offset-4 transition-colors hover:text-fg hover:underline sm:inline"
          >
            Napište nám
          </Link>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            className="flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:border-line-strong"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </Container>

      {open && (
        <div id="menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 bg-bg">
          <Container className="flex h-full flex-col justify-between pt-32 pb-10">
            <nav aria-label="Hlavní navigace">
              <ul className="space-y-1">
                {navigation.map((item, index) => (
                  <li key={item.href}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={close}
                      className="lit inline-block text-5xl leading-[1.1] font-semibold tracking-tight sm:text-7xl"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a href={`mailto:${site.email}`} className="font-mono text-sm text-fg-dim hover:text-fg">
              {site.email}
            </a>
          </Container>
        </div>
      )}
    </header>
  )
}
