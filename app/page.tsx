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
      <AriaTeaser />
      <Projects />
      <Process />
      <Team />
    </>
  )
}
