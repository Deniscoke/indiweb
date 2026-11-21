import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Martian_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { I18nProvider } from '@/components/i18n/i18n-provider'
import { Footer } from '@/components/layout/footer'
import { IntroCinematic } from '@/components/intro/intro-cinematic'
import { Header } from '@/components/layout/header'
import { PointerLight } from '@/components/light/pointer-light'
import { SmoothScroll } from '@/components/story/smooth-scroll'
import { getDictionary, introGate } from '@/content/locales'
import { site } from '@/content/site'
import { isLocale, LOCALES, OG_LOCALES } from '@/lib/i18n'
import { INTRO_BOOT_SCRIPT } from '@/lib/intro'
import 'lenis/dist/lenis.css'
import '../globals.css'
import '../story.css'

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

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = getDictionary(lang)
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.site.title, template: `%s — ${site.name}` },
    description: dict.site.description,
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[lang],
      siteName: site.name,
      title: dict.site.title,
      description: dict.site.description,
    },
  }
}

export const viewport: Viewport = { themeColor: '#000000' }

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  // The proxy only lets the three languages through; anything else has no page.
  if (!isLocale(lang)) notFound()
  const dict = getDictionary(lang)

  return (
    <html
      lang={lang}
      // Tells Next the smooth scrolling is ours, so page changes still jump to the top at once.
      data-scroll-behavior="smooth"
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
        <I18nProvider locale={lang} dict={dict}>
          <IntroCinematic gate={introGate()} />
          <SmoothScroll />
          <PointerLight />
          <div aria-hidden="true" className="ambient-grain" />
          <a
            href="#obsah"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
          >
            {dict.common.skipToContent}
          </a>
          <Header />
          <main id="obsah" className="relative z-10">
            {children}
          </main>
          <Footer locale={lang} />
        </I18nProvider>
        {/* Cookieless visit counts (Vercel Web Analytics); described on the privacy page. */}
        <Analytics />
      </body>
    </html>
  )
}
