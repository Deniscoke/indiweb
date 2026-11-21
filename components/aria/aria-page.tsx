import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { ARIA_NAME } from '@/content/aria'
import { getDictionary } from '@/content/locales'
import { CONTACT_ID } from '@/content/site'
import { localizedPath, type Locale } from '@/lib/i18n'
import { ScrambleText } from './scramble-text'
import { VoiceDemo } from './voice-demo'
import { VoiceDots } from './voice-dots'

const TRY_ARIA_ID = 'vyzkouset-ariu'

type AriaPageProps = { locale: Locale; voiceDemo?: boolean }

/** `voiceDemo`: the live call with Aria is set up, so visitors can try her right on the page. */
export function AriaPage({ locale, voiceDemo = false }: AriaPageProps) {
  const { aria } = getDictionary(locale)
  const t = aria.page
  // The inquiry form on the home page, with the AI service already chosen.
  const inquiryHref = `${localizedPath(locale, { name: 'home' })}?sluzba=ai#${CONTACT_ID}`
  return (
    <>
      <section aria-labelledby="aria-nadpis">
        <Container className="grid min-h-svh items-center gap-16 pt-36 pb-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-mono text-xs text-accent">{t.eyebrow}</p>
            <h1
              id="aria-nadpis"
              className="lit mt-6 text-[clamp(5rem,16vw,12rem)] leading-[0.85] font-semibold tracking-[-0.06em]"
            >
              {ARIA_NAME}
            </h1>
            <p className="mt-8 font-mono text-xl text-balance sm:text-2xl">
              <ScrambleText text={aria.tagline} />
            </p>
            <p className="mt-6 max-w-xl text-lg text-fg-dim">{aria.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={inquiryHref}>{t.cta}</ButtonLink>
              {voiceDemo && (
                <ButtonLink href={`#${TRY_ARIA_ID}`} variant="ghost">
                  {aria.try}
                </ButtonLink>
              )}
            </div>
          </div>
          <div id={TRY_ARIA_ID} className="scroll-mt-28">
            {voiceDemo ? <VoiceDemo /> : <VoiceDots />}
          </div>
        </Container>
      </section>

      <section aria-labelledby="aria-umi" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="aria-umi" title={t.capabilitiesTitle} />
          <ul className="mt-16 grid border-t border-line md:grid-cols-2">
            {aria.capabilities.map((capability) => (
              <li key={capability} className="border-b border-line py-8 text-2xl tracking-tight md:odd:pr-10 md:even:pl-10 md:even:border-l">
                <p>{capability}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-pro-koho" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="aria-pro-koho" title={t.audienceTitle} />
          <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-4 font-mono text-sm text-fg-dim">
            {aria.audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="aria-nasazeni" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="aria-nasazeni" title={t.rolloutTitle} />
          <StepList steps={aria.rollout} className="mt-16" />
        </Container>
      </section>

      <section aria-labelledby="aria-cta" className="py-20 sm:py-28">
        <Container>
          <div className="relative border-y border-line py-20 text-center">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent to-transparent"
            />
            <h2 id="aria-cta" className="lit text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
              {t.closingTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-fg-dim">
              {t.closingLead}
            </p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href={inquiryHref}>{t.cta}</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
