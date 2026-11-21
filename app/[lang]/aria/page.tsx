import type { Metadata } from 'next'
import { AriaPage } from '@/components/aria/aria-page'
import { JsonLd } from '@/components/seo/json-ld'
import { getDictionary } from '@/content/locales'
import { pageLocale } from '@/lib/page-locale'
import { ariaJsonLd, pageMetadata } from '@/lib/seo'
import { voiceDemoEnabled } from '@/lib/voice-demo-enabled'

export async function generateMetadata({ params }: PageProps<'/[lang]/aria'>): Promise<Metadata> {
  const locale = await pageLocale(params)
  const { aria } = getDictionary(locale)
  return pageMetadata({
    locale,
    title: aria.page.metaTitle,
    description: aria.page.metaDescription,
    route: { name: 'aria' },
  })
}

export default async function Page({ params }: PageProps<'/[lang]/aria'>) {
  const locale = await pageLocale(params)
  return (
    <>
      <JsonLd data={ariaJsonLd(locale, getDictionary(locale))} />
      <AriaPage locale={locale} voiceDemo={voiceDemoEnabled()} />
    </>
  )
}
