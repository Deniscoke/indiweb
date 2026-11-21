import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact/contact-section'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { FabStore } from '@/components/home/fab-store'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Projects } from '@/components/home/projects'
import { Services } from '@/components/home/services'
import { SplatShowcase } from '@/components/home/splat-showcase'
import { Team } from '@/components/home/team'
import { JsonLd } from '@/components/seo/json-ld'
import { getDictionary } from '@/content/locales'
import { pageLocale } from '@/lib/page-locale'
import { homeJsonLd, pageMetadata } from '@/lib/seo'
import { voiceDemoEnabled } from '@/lib/voice-demo-enabled'

// The layout's title template applies only to child segments, so this title stays as written.
export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const locale = await pageLocale(params)
  const { title, description } = getDictionary(locale).site
  return pageMetadata({ locale, title, description, route: { name: 'home' } })
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const locale = await pageLocale(params)
  return (
    <>
      <JsonLd data={homeJsonLd(locale, getDictionary(locale))} />
      <Hero />
      <Services />
      <SplatShowcase />
      <AriaTeaser voiceDemo={voiceDemoEnabled()} />
      <Projects />
      <FabStore />
      <Process />
      <Team />
      <ContactSection locale={locale} />
    </>
  )
}
