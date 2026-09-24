import Image from 'next/image'
import Link from 'next/link'
import { TagList } from '@/components/ui/tag-list'
import { PROJECT_IMAGE_SIZE } from '@/content/projects'
import type { Project } from '@/content/types'
import { MARKET_LABELS } from '@/lib/projects'

export function ProjectCard({ project }: { project: Project }) {
  const host = new URL(project.liveUrl).host

  return (
    <article className="group relative">
      <div className="relative overflow-hidden bg-bg-soft">
        <Image
          src={project.image}
          alt={`Úvodní obrazovka webu ${project.title}`}
          width={PROJECT_IMAGE_SIZE.width}
          height={PROJECT_IMAGE_SIZE.height}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full brightness-75 grayscale transition-[filter,scale] duration-700 ease-out group-hover:scale-[1.02] group-hover:brightness-100 group-hover:grayscale-0 motion-reduce:transition-none"
        />
        {/* A rim of light appears around the screenshot as it comes to colour. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_0_1px_rgb(217_184_255/0.5),inset_0_-40px_80px_-40px_rgb(217_184_255/0.35)] transition-opacity duration-700 group-hover:opacity-100"
        />
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-6 font-mono text-xs text-fg-faint">
        <span>{host}</span>
        <span>{MARKET_LABELS[project.market]}</span>
      </div>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight">
        <Link href={`/projekty/${project.slug}`} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      <p className="mt-1 text-fg-dim">{project.client}</p>
      <p className="mt-4 max-w-md text-pretty">{project.summary}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <TagList tags={project.tags} />
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 text-sm text-accent underline-offset-4 hover:underline"
        >
          Živá ukázka <span aria-hidden="true">↗</span>{' '}
          <span className="sr-only">(otevře se v novém okně)</span>
        </a>
      </div>
    </article>
  )
}
