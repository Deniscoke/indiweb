import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact/contact-section'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Projects } from '@/components/home/projects'
import { Services } from '@/components/home/services'
import { SplatShowcase } from '@/components/home/splat-showcase'
import { Team } from '@/components/home/team'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/content/site'
import { organizationJsonLd, pageMetadata } from '@/lib/seo'
import { voiceDemoEnabled } from '@/lib/voice-demo-enabled'

// The layout's title template applies only to child segments, so this title stays as written.
export const metadata: Metadata = pageMetadata({ title: site.title, description: site.description, path: '/' })

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <Services />
      <SplatShowcase />
      <AriaTeaser voiceDemo={voiceDemoEnabled()} />
      <Projects />
      <Process />
      <Team />
      <ContactSection />
    </>
  )
}
