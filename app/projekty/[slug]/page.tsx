import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/project/project-detail'
import { projects } from '@/content/projects'
import { getNextProject, getProject } from '@/lib/projects'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projekty/${project.slug}`,
    // The site's own screenshot makes the best share picture for a project.
    image: project.image,
  })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <ProjectDetail project={project} next={getNextProject(slug)} />
}
