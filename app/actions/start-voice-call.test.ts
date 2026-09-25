import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { headerStore } = vi.hoisted(() => ({ headerStore: new Map<string, string>() }))

vi.mock('next/headers', () => ({
  headers: async () => ({ get: (name: string) => headerStore.get(name) ?? null }),
}))

import { startVoiceCall } from '@/app/actions/start-voice-call'

const fetchMock = vi.fn()
let visitor = 0

beforeEach(() => {
  vi.stubEnv('ELEVENLABS_API_KEY', 'test-key')
  vi.stubEnv('ELEVENLABS_AGENT_ID', 'agent_test')
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  // A fresh visitor per test, so the rate limit of one test does not leak into the next.
  headerStore.set('x-forwarded-for', `203.0.113.${++visitor}, 10.0.0.1`)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('startVoiceCall', () => {
  it('returns a conversation token fetched with the server-side key', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ token: 'conv_123' }), { status: 200 }))
    await expect(startVoiceCall()).resolves.toEqual({ status: 'ready', token: 'conv_123' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_test')
    expect(init.headers['xi-api-key']).toBe('test-key')
  })

  it('is unavailable, without calling ElevenLabs, when not configured', async () => {
    vi.stubEnv('ELEVENLABS_API_KEY', '')
    await expect(startVoiceCall()).resolves.toEqual({ status: 'unavailable' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('is unavailable when ElevenLabs refuses (e.g. the daily limit is used up)', async () => {
    fetchMock.mockResolvedValue(new Response('limit', { status: 429 }))
    await expect(startVoiceCall()).resolves.toEqual({ status: 'unavailable' })
  })

  it('is unavailable when the network fails', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    await expect(startVoiceCall()).resolves.toEqual({ status: 'unavailable' })
  })

  it('slows down one visitor starting call after call', async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ token: 't' }), { status: 200 }))
    const results = []
    for (let i = 0; i < 6; i++) results.push((await startVoiceCall()).status)
    expect(results.slice(0, 4)).toEqual(['ready', 'ready', 'ready', 'ready'])
    expect(results[5]).toBe('busy')
  })
})
