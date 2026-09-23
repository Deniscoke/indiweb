import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { team } from '@/content/team'
import { TeamCard } from './team-card'

export function Team() {
  return (
    <section id="o-nas" aria-labelledby="o-nas-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="o-nas-nadpis"
          eyebrow="O nás"
          title="Tři kluci, kteří tvoří weby, 3D a AI."
          lead="Malý tým znamená, že mluvíte přímo s námi — bez prostředníků a přeposílání."
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {team.map((member, index) => (
            <li key={member.slug}>
              <Reveal delay={index * 100} className="h-full">
                <TeamCard member={member} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
