import type { Metadata } from 'next'
import { PrivacyPage } from '@/components/legal/privacy-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ochrana osobních údajů',
  description: 'Jaké údaje web IndiWeb zpracovává, proč, jak dlouho a jaká máte práva.',
  path: '/ochrana-osobnich-udaju',
})

export default function Page() {
  return <PrivacyPage />
}
