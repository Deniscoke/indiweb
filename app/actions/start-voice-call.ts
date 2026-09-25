'use server'

import { headers } from 'next/headers'
import { createRateLimiter } from '@/lib/rate-limit'

export type VoiceCallStart =
  | { status: 'ready'; token: string }
  /** Too many calls from this visitor in a short time. */
  | { status: 'busy' }
  /** Not configured, or ElevenLabs refused (e.g. the daily limit is used up). */
  | { status: 'unavailable' }

// Four demo calls per visitor per ten minutes is plenty for trying it out.
const limiter = createRateLimiter({ limit: 4, windowMs: 10 * 60 * 1000 })

/**
 * Issues a one-time WebRTC token for the voice demo. The ElevenLabs key stays
 * on the server; the agent only accepts conversations that come with a token.
 */
export async function startVoiceCall(): Promise<VoiceCallStart> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID
  if (!apiKey || !agentId) {
    console.error('[startVoiceCall] ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID is not set')
    return { status: 'unavailable' }
  }

  const forwarded = (await headers()).get('x-forwarded-for') ?? ''
  const visitor = forwarded.split(',')[0]?.trim() || 'unknown'
  if (!limiter.take(visitor)) return { status: 'busy' }

  try {
    const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/token')
    url.searchParams.set('agent_id', agentId)
    const response = await fetch(url, { headers: { 'xi-api-key': apiKey }, cache: 'no-store' })
    if (!response.ok) {
      console.error('[startVoiceCall] ElevenLabs refused the token', response.status, await response.text())
      return { status: 'unavailable' }
    }
    const { token } = (await response.json()) as { token?: unknown }
    if (typeof token !== 'string' || !token) return { status: 'unavailable' }
    return { status: 'ready', token }
  } catch (error) {
    console.error('[startVoiceCall] Requesting a token failed', error)
    return { status: 'unavailable' }
  }
}
