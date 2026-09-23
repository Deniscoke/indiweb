import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { projects } from '@/content/projects'
import { ProjectCard } from './project-card'

export function Projects() {
  return (
    <section id="projekty" aria-labelledby="projekty-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="projekty-nadpis"
          eyebrow="Projekty"
          title="Každý klient dostane web, který sedí jemu. Ne šabloně."
          lead="Výtahová firma potřebuje něco jiného než terapeutka. Podívejte se, jak to vypadá v praxi."
        />
        <ul className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Reveal delay={index * 120}>
                <ProjectCard project={project} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
