import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { StepList } from '@/components/ui/step-list'
import { processSteps } from '@/content/process'

export function Process() {
  return (
    <section id="postup" aria-labelledby="postup-nadpis" className="py-20 sm:py-40">
      <Container>
        <SectionHeading id="postup-nadpis" title="Od první zprávy po spuštění ve čtyřech krocích." />
        <StepList steps={processSteps} className="mt-12 sm:mt-20" />
      </Container>
    </section>
  )
}
