import Image from 'next/image'
import Link from 'next/link'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { TagList } from '@/components/ui/tag-list'
import { PROJECT_IMAGE_SIZE } from '@/content/projects'
import type { Project } from '@/content/types'
import { MARKET_LABELS } from '@/lib/projects'

export function ProjectCard({ project }: { project: Project }) {
  const host = new URL(project.liveUrl).host

  return (
    <article className="group relative flex flex-col gap-6">
      <BrowserFrame
        url={host}
        className="transition-transform duration-500 motion-safe:group-hover:-translate-y-1"
      >
        <Image
          src={project.image}
          alt={`Úvodní obrazovka webu ${project.title}`}
          width={PROJECT_IMAGE_SIZE.width}
          height={PROJECT_IMAGE_SIZE.height}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </BrowserFrame>
      <div>
        <p className="text-xs tracking-[0.18em] text-fg-faint uppercase">
          {project.client} · {MARKET_LABELS[project.market]}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          <Link href={`/projekty/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-fg-dim">{project.summary}</p>
        <TagList tags={project.tags} className="mt-4" />
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-strong"
        >
          Živá ukázka <span aria-hidden="true">↗</span>
          {' '}
          <span className="sr-only">(otevře se v novém okně)</span>
        </a>
      </div>
    </article>
  )
}
