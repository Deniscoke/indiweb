import type { Metadata } from 'next'
import { PrivacyPage } from '@/components/legal/privacy-page'
import { JsonLd } from '@/components/seo/json-ld'
import { getPrivacy } from '@/content/locales/privacy'
import { pageLocale } from '@/lib/page-locale'
import { pageMetadata, privacyJsonLd } from '@/lib/seo'

type Props = PageProps<'/[lang]/ochrana-osobnich-udaju'>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params)
  const privacy = getPrivacy(locale)
  return pageMetadata({
    locale,
    title: privacy.metaTitle,
    description: privacy.metaDescription,
    route: { name: 'privacy' },
  })
}

export default async function Page({ params }: Props) {
  const locale = await pageLocale(params)
  const privacy = getPrivacy(locale)
  return (
    <>
      <JsonLd data={privacyJsonLd(locale, privacy)} />
      <PrivacyPage privacy={privacy} />
    </>
  )
}
