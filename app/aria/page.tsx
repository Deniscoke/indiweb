import type { Metadata } from 'next'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'

export const metadata: Metadata = {
  title: 'Aria — AI hlasový agent',
  description: aria.description,
}

export default function Page() {
  return <AriaPage />
}
