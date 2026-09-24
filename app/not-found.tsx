import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-start justify-center gap-6 pt-32 pb-20">
      <p className="font-mono text-xs text-fg-faint">Chyba 404</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        Tahle stránka neexistuje.
      </h1>
      <p className="max-w-lg text-fg-dim">
        Možná byla přesunuta, nebo je v odkazu překlep. Zkuste to z úvodní stránky.
      </p>
      <ButtonLink href="/" withArrow>
        Zpět na úvod
      </ButtonLink>
    </Container>
  )
}
