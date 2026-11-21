'use client'

import { useI18n } from '@/components/i18n/i18n-provider'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { localizedPath } from '@/lib/i18n'

// A not-found page gets no params; the language comes from the layout's provider.
export default function NotFound() {
  const { locale, dict } = useI18n()
  const t = dict.notFound
  return (
    <Container className="flex min-h-[80vh] flex-col items-start justify-center gap-6 pt-32 pb-20">
      <p className="font-mono text-xs text-fg-faint">{t.eyebrow}</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">{t.title}</h1>
      <p className="max-w-lg text-fg-dim">{t.text}</p>
      <ButtonLink href={localizedPath(locale, { name: 'home' })} withArrow>
        {t.home}
      </ButtonLink>
    </Container>
  )
}
