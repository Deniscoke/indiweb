import { Suspense } from 'react'
import { FinaleHeading } from '@/components/story/finale-heading'
import { Container } from '@/components/ui/container'
import { site } from '@/content/site'
import { InquiryForm, InquiryFormWithParams } from './inquiry-form'

export function ContactSection() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-nadpis" className="overflow-x-clip py-20 sm:py-40">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          {/* Lit by the pointer instead of the reveal sweep: the sweep's filter breaks the fixed light. */}
          <FinaleHeading
            id="kontakt-nadpis"
            text="Pojďme do toho."
            className="text-6xl leading-[0.95] font-semibold tracking-[-0.045em] sm:text-8xl"
          />
          <p className="mt-8 max-w-sm text-lg text-fg-dim">
            Napište nám pár vět o svém projektu. Ozveme se do 24 hodin s prvními nápady, nezávazně.
          </p>
          <p className="mt-10 text-sm text-fg-faint">
            Raději e-mailem?{' '}
            <a href={`mailto:${site.email}`} className="inline-block py-3 font-mono text-fg-dim underline underline-offset-4 hover:text-fg">
              {site.email}
            </a>
          </p>
        </div>
        <Suspense fallback={<InquiryForm />}>
          <InquiryFormWithParams />
        </Suspense>
      </Container>
    </section>
  )
}
