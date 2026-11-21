import { Container } from '@/components/ui/container'
import type { Privacy, PrivacyBlock } from '@/content/locales/privacy'
import { site } from '@/content/site'
import { format } from '@/lib/i18n'

/** The Czech data protection authority, where complaints go. */
const AUTHORITY = { label: 'uoou.gov.cz', url: 'https://uoou.gov.cz' }

const LINK = 'text-fg underline underline-offset-4 hover:text-accent'

function Block({ block, privacy }: { block: PrivacyBlock; privacy: Privacy }) {
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
        <a href={`mailto:${site.email}`} className={`font-mono ${LINK}`}>
          {site.email}
        </a>
      </p>
    )
  }
  return (
    <p>
      {privacy.authority}{' '}
      <a href={AUTHORITY.url} target="_blank" rel="noopener noreferrer" className={LINK}>
        {AUTHORITY.label}
      </a>
      {privacy.authorityAfter}
    </p>
  )
}

/** The privacy notice, laid out as a calm long read. The page hands in the notice in its language. */
export function PrivacyPage({ privacy }: { privacy: Privacy }) {
  return (
    <Container className="pt-36 pb-24 sm:pt-44 sm:pb-32">
      <article className="mx-auto max-w-2xl">
        <p className="font-mono text-xs text-accent">{privacy.eyebrow}</p>
        <h1 className="mt-6 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] break-words hyphens-auto sm:text-6xl">
          {privacy.title}
        </h1>
        <p className="mt-8 text-lg text-pretty text-fg-dim">{privacy.intro}</p>
        <p className="mt-4 font-mono text-xs text-fg-faint">{format(privacy.effective, { date: privacy.updated })}</p>

        {privacy.sections.map((section) => (
          <section key={section.title} className="mt-14 border-t border-line pt-8">
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <div className="mt-4 space-y-4 text-pretty text-fg-dim">
              {section.body.map((block, index) => (
                <Block key={index} block={block} privacy={privacy} />
              ))}
            </div>
          </section>
        ))}
      </article>
    </Container>
  )
}
