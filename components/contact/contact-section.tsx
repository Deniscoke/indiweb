import { Suspense } from 'react'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { site } from '@/content/site'
import { InquiryForm, InquiryFormWithParams } from './inquiry-form'

export function ContactSection() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-nadpis" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-surface p-8 sm:p-14">
            <h2
              id="kontakt-nadpis"
              className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Pojďme do toho.
            </h2>
            <p className="mt-4 text-lg text-fg-dim">
              Napište nám pár vět o svém projektu. Ozveme se do 24 hodin s prvními nápady —
              nezávazně.
            </p>
            <div className="mt-10">
              <Suspense fallback={<InquiryForm />}>
                <InquiryFormWithParams />
              </Suspense>
            </div>
            <p className="mt-8 text-sm text-fg-faint">
              Raději e-mailem? Pište na{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-fg-dim underline underline-offset-4 hover:text-fg"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
