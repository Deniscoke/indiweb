import { ContactSection } from '@/components/contact/contact-section'
import { AriaTeaser } from '@/components/home/aria-teaser'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Projects } from '@/components/home/projects'
import { Services } from '@/components/home/services'
import { Team } from '@/components/home/team'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      {/* The live call appears once ElevenLabs is configured (see .env.example). */}
      <AriaTeaser voiceDemo={Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_AGENT_ID)} />
      <Projects />
      <Process />
      <Team />
      <ContactSection />
    </>
  )
}
