import { Container } from '@/components/ui/container'
import { privacy, type PrivacyBlock } from '@/content/privacy'

const LINK = 'text-fg underline underline-offset-4 hover:text-accent'

function Block({ block }: { block: PrivacyBlock }) {
  if ('p' in block) return <p>{block.p}</p>
  if ('list' in block) {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-accent">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  if ('contact' in block) {
    return (
      <p>
        <a href={`mailto:${privacy.controller.email}`} className={`font-mono ${LINK}`}>
          {privacy.controller.email}
        </a>
      </p>
    )
  }
  return (
    <p>
      Pokud se domníváte, že s vašimi údaji nezacházíme v souladu s předpisy, můžete podat stížnost u dozorového
      úřadu: Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7,{' '}
      <a href="https://uoou.gov.cz" target="_blank" rel="noopener noreferrer" className={LINK}>
        uoou.gov.cz
      </a>
      .
    </p>
  )
}

/** The privacy notice, laid out as a calm long read. */
export function PrivacyPage() {
  return (
    <Container className="pt-36 pb-24 sm:pt-44 sm:pb-32">
      <article className="mx-auto max-w-2xl">
        <p className="font-mono text-xs text-accent">Právní informace</p>
        <h1 className="mt-6 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl">
          Ochrana osobních údajů
        </h1>
        <p className="mt-8 text-lg text-pretty text-fg-dim">{privacy.intro}</p>
        <p className="mt-4 font-mono text-xs text-fg-faint">Platné od {privacy.updated}</p>

        {privacy.sections.map((section) => (
          <section key={section.title} className="mt-14 border-t border-line pt-8">
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <div className="mt-4 space-y-4 text-pretty text-fg-dim">
              {section.body.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </div>
          </section>
        ))}
      </article>
    </Container>
  )
}
