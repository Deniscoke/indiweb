import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { site } from '@/content/site'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })
const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
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

export const viewport: Viewport = { themeColor: '#08080a' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" className={`${inter.variable} ${bricolage.variable}`}>
      <head>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <div aria-hidden="true" className="ambient-glow" />
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
