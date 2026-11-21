import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/project/project-detail'
import { JsonLd } from '@/components/seo/json-ld'
import { getDictionary } from '@/content/locales'
import { projects } from '@/content/projects'
import { pageLocale } from '@/lib/page-locale'
import { getNextProject, getProject } from '@/lib/projects'
import { pageMetadata, projectJsonLd } from '@/lib/seo'

type Props = PageProps<'/[lang]/projekty/[slug]'>

export const dynamicParams = false

// The languages come from the layout; every one of them gets every project.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params)
  const project = getProject((await params).slug, getDictionary(locale))
  if (!project) return {}
  return pageMetadata({
    locale,
    title: project.title,
    description: project.summary,
    route: { name: 'project', slug: project.slug },
    // The site's own screenshot makes the best share picture for a project.
    image: project.image,
  })
}

export default async function Page({ params }: Props) {
  const locale = await pageLocale(params)
  const { slug } = await params
  const dict = getDictionary(locale)
  const project = getProject(slug, dict)
  if (!project) notFound()
  return (
    <>
      <JsonLd data={projectJsonLd(locale, project)} />
      <ProjectDetail locale={locale} project={project} next={getNextProject(slug, dict)} />
    </>
  )
}
