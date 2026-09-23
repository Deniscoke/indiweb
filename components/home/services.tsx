import Image from 'next/image'
import { BulletList } from '@/components/ui/bullet-list'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { services } from '@/content/services'
import { media } from '@/content/site'

export function Services() {
  const featured = services.find((service) => service.featured)
  const others = services.filter((service) => !service.featured)

  return (
    <section id="sluzby" aria-labelledby="sluzby-nadpis" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="sluzby-nadpis"
          eyebrow="Co děláme"
          title="Web je základ. 3D a AI jsou důvod, proč bude lepší."
          lead="Navrhujeme a stavíme weby na míru. A když to dává smysl, přidáme 3D, splaty nebo AI agenta, který za vás odvede kus práce."
        />

        {featured && (
          <Reveal className="mt-14">
            <article className="grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <p className="text-xs tracking-[0.2em] text-accent uppercase">Hlavní služba</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-fg-dim">{featured.summary}</p>
                <BulletList items={featured.points} className="mt-8 text-sm text-fg-dim" />
              </div>
              <div className="relative min-h-64 lg:min-h-full">
                <Image
                  src={media.laptop.src}
                  alt={media.laptop.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </article>
          </Reveal>
        )}

        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {others.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={index * 100} className="h-full">
                <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-8">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-fg-dim">{service.summary}</p>
                  <BulletList items={service.points} className="mt-6 text-sm text-fg-dim" />
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
