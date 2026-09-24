import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { projects } from '@/content/projects'
import { cn } from '@/lib/cn'
import { ProjectCard } from './project-card'

export function Projects() {
  return (
    <section id="projekty" aria-labelledby="projekty-nadpis" className="py-20 sm:py-40">
      <Container>
        <SectionHeading
          id="projekty-nadpis"
          title="Každý klient dostane web, který sedí jemu. Ne šabloně."
          lead="Výtahová firma potřebuje něco jiného než terapeutka. Podívejte se, jak to vypadá v praxi."
        />
        <ul className="mt-12 grid gap-16 sm:mt-20 md:grid-cols-2 md:gap-12">
          {projects.map((project, index) => (
            // Every other project steps down for an editorial rhythm.
            <li key={project.slug} className={cn(index % 2 === 1 && 'md:mt-40')}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
