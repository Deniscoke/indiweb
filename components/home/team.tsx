import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { team } from '@/content/team'
import { TeamCard } from './team-card'

export function Team() {
  return (
    <section id="o-nas" aria-labelledby="o-nas-nadpis" className="py-20 sm:py-40">
      <Container>
        <SectionHeading
          id="o-nas-nadpis"
          title="Tři kluci, kteří tvoří weby, 3D a AI."
          lead="Malý tým znamená, že mluvíte přímo s námi — bez prostředníků a přeposílání."
        />
        <ul className="mt-12 border-b sm:mt-20 border-line">
          {team.map((member) => (
            <li key={member.slug} className="border-t border-line">
              <TeamCard member={member} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
