import Image from 'next/image'
import Link from 'next/link'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { TagList } from '@/components/ui/tag-list'
import { PROJECT_IMAGE_SIZE } from '@/content/projects'
import type { Project } from '@/content/types'
import { MARKET_LABELS } from '@/lib/projects'

export function ProjectDetail({ project, next }: { project: Project; next?: Project }) {
  const host = new URL(project.liveUrl).host

  return (
    <article className="pt-32 pb-24">
      <Container>
        <Link href="/#projekty" className="text-sm text-fg-dim transition-colors hover:text-fg">
          ← Všechny projekty
        </Link>
        <p className="mt-10 flex flex-wrap gap-x-6 font-mono text-xs text-fg-faint">
          <span>{project.client}</span>
          <span>{MARKET_LABELS[project.market]}</span>
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-dim">{project.summary}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={project.liveUrl} external withArrow>
            Otevřít web
          </ButtonLink>
          <ButtonLink href="/#kontakt" variant="ghost">
            Chci podobný web
          </ButtonLink>
        </div>

        <BrowserFrame url={host} className="mt-14">
          <Image
            src={project.image}
            alt={`Úvodní obrazovka webu ${project.title}`}
            width={PROJECT_IMAGE_SIZE.width}
            height={PROJECT_IMAGE_SIZE.height}
            sizes="(min-width: 1152px) 1152px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full"
          />
        </BrowserFrame>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <section aria-labelledby="o-projektu">
            <h2 id="o-projektu" className="font-display text-2xl font-semibold">
              O projektu
            </h2>
            <p className="mt-4 leading-relaxed text-fg-dim">{project.description}</p>
          </section>
          <section aria-labelledby="co-web-umi">
            <h2 id="co-web-umi" className="font-display text-2xl font-semibold">
              Co web umí
            </h2>
            <BulletList items={project.highlights} className="mt-4 text-fg-dim" />
            <TagList tags={project.tags} className="mt-6" />
          </section>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          {next ? (
            <nav aria-label="Další projekt">
              <p className="text-sm text-fg-faint">Další projekt</p>
              <Link
                href={`/projekty/${next.slug}`}
                className="mt-2 inline-block font-display text-3xl font-semibold transition-colors hover:text-accent"
              >
                {next.title} →
              </Link>
            </nav>
          ) : (
            <div />
          )}
          <ButtonLink href="/#kontakt" variant="ghost">
            Chci podobný web
          </ButtonLink>
        </div>
      </Container>
    </article>
  )
}
