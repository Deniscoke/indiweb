import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Martian_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/footer'
import { IntroCinematic } from '@/components/intro/intro-cinematic'
import { Header } from '@/components/layout/header'
import { PointerLight } from '@/components/light/pointer-light'
import { SmoothScroll } from '@/components/story/smooth-scroll'
import { site } from '@/content/site'
import { INTRO_BOOT_SCRIPT } from '@/lib/intro'
import 'lenis/dist/lenis.css'
import './globals.css'
import './story.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
  display: 'swap',
})
const martian = Martian_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-martian',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
}

export const viewport: Viewport = { themeColor: '#000000' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="cs"
      className={`${bricolage.variable} ${martian.variable}`}
      // The intro boot script may set data-intro before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <noscript>
          <style>{'.reveal{--reveal:1!important}'}</style>
        </noscript>
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <IntroCinematic />
        <SmoothScroll />
        <PointerLight />
        <div aria-hidden="true" className="ambient-grain" />
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Přeskočit na obsah
        </a>
        <Header />
        <main id="obsah" className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
