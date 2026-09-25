import { ContactSection } from '@/components/contact/contact-section'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Projects } from '@/components/home/projects'
import { Services } from '@/components/home/services'
import { SplatShowcase } from '@/components/home/splat-showcase'
import { Team } from '@/components/home/team'
import { voiceDemoEnabled } from '@/lib/voice-demo-enabled'

export default function HomePage() {
  return (
    <>
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
