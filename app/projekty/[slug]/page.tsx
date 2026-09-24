import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/project/project-detail'
import { projects } from '@/content/projects'
import { getNextProject, getProject } from '@/lib/projects'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return { title: project.title, description: project.summary }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <ProjectDetail project={project} next={getNextProject(slug)} />
}
