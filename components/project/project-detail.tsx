import Image from 'next/image'
import Link from 'next/link'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { BulletList } from '@/components/ui/bullet-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { TagList } from '@/components/ui/tag-list'
import { getDictionary } from '@/content/locales'
import { PROJECT_IMAGE_SIZE } from '@/content/projects'
import { CONTACT_ID, PROJECTS_ID } from '@/content/site'
import type { Project } from '@/content/types'
import { format, localizedPath, type Locale } from '@/lib/i18n'

type ProjectDetailProps = { locale: Locale; project: Project; next?: Project }

export function ProjectDetail({ locale, project, next }: ProjectDetailProps) {
  const dict = getDictionary(locale)
  const t = dict.projects
  const home = localizedPath(locale, { name: 'home' })
  const host = new URL(project.liveUrl).host

  return (
    <article className="pt-32 pb-24">
      <Container>
        <Link href={`${home}#${PROJECTS_ID}`} className="text-sm text-fg-dim transition-colors hover:text-fg">
          ← {t.back}
        </Link>
        <p className="mt-10 flex flex-wrap gap-x-6 font-mono text-xs text-fg-faint">
          <span>{project.client}</span>
          <span>{dict.common.markets[project.market]}</span>
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-dim">{project.summary}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={project.liveUrl} external withArrow>
            {t.openSite}
          </ButtonLink>
          <ButtonLink href={`${home}#${CONTACT_ID}`} variant="ghost">
            {t.wantSimilar}
          </ButtonLink>
        </div>

        <BrowserFrame url={host} className="mt-14">
          <Image
            src={project.image}
            alt={format(t.screenshotAlt, { title: project.title })}
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
              {t.about}
            </h2>
            <p className="mt-4 leading-relaxed text-fg-dim">{project.description}</p>
          </section>
          <section aria-labelledby="co-web-umi">
            <h2 id="co-web-umi" className="font-display text-2xl font-semibold">
              {t.features}
            </h2>
            <BulletList items={project.highlights} className="mt-4 text-fg-dim" />
            <TagList tags={project.tags} className="mt-6" />
          </section>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          {next ? (
            <nav aria-label={t.next}>
              <p className="text-sm text-fg-faint">{t.next}</p>
              <Link
                href={localizedPath(locale, { name: 'project', slug: next.slug })}
                className="mt-2 inline-block font-display text-3xl font-semibold transition-colors hover:text-accent"
              >
                {next.title} →
              </Link>
            </nav>
          ) : (
            <div />
          )}
          <ButtonLink href={`${home}#${CONTACT_ID}`} variant="ghost">
            {t.wantSimilar}
          </ButtonLink>
        </div>
      </Container>
    </article>
  )
}
