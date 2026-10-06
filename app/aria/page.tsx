import type { Metadata } from 'next'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'
import { pageMetadata } from '@/lib/seo'
import { voiceDemoEnabled } from '@/lib/voice-demo-enabled'

export const metadata: Metadata = pageMetadata({
  title: 'Aria — AI hlasový agent, který zvedne každý telefon',
  description: aria.description,
  path: '/aria',
})

export default function Page() {
  return <AriaPage voiceDemo={voiceDemoEnabled()} />
}
