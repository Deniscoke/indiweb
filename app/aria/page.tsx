import type { Metadata } from 'next'
import { AriaPage } from '@/components/aria/aria-page'
import { aria } from '@/content/aria'
import { voiceDemoEnabled } from '@/lib/voice-demo-enabled'

const TITLE = 'Aria — AI hlasový agent, který zvedne každý telefon'

export const metadata: Metadata = {
  title: TITLE,
  description: aria.description,
  alternates: { canonical: '/aria' },
  openGraph: {
    title: TITLE,
    description: aria.description,
    url: '/aria',
  },
}

export default function Page() {
  return <AriaPage voiceDemo={voiceDemoEnabled()} />
}
