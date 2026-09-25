import { describe, expect, it } from 'vitest'
import { aria } from '@/content/aria'
import { processSteps } from '@/content/process'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { team } from '@/content/team'
import { VOICES, voiceAgentConfig, voiceAgentPrompt } from '@/lib/voice-agent'

describe('voiceAgentPrompt', () => {
  const prompt = voiceAgentPrompt()

  it('knows everything the site says about IndiWeb', () => {
    for (const service of services) {
      expect(prompt).toContain(service.title)
      for (const point of service.points) expect(prompt).toContain(point)
    }
    for (const step of processSteps) expect(prompt).toContain(step.title)
    for (const member of team) expect(prompt).toContain(member.name)
    for (const capability of aria.capabilities) expect(prompt).toContain(capability)
    expect(prompt).toContain(site.email)
  })

  it('keeps the agent short-spoken, on topic and honest', () => {
    expect(prompt).toMatch(/krátk/i)
    expect(prompt).toMatch(/nevymýšlej/i)
    expect(prompt).toMatch(/AI/)
  })
})

describe('voiceAgentConfig', () => {
  const config = voiceAgentConfig()

  it('speaks Czech with the default voice and a short, capped conversation', () => {
    expect(config.conversation_config.agent.language).toBe('cs')
    expect(config.conversation_config.tts.voice_id).toBe(VOICES[0].id)
    expect(config.conversation_config.conversation.max_duration_seconds).toBeLessThanOrEqual(180)
  })

  it('lets the browser change only the voice, never the prompt', () => {
    const overrides = config.platform_settings.overrides.conversation_config_override
    expect(overrides.tts).toEqual({ voice_id: true })
    expect(overrides.agent).toEqual({ first_message: false, language: false, prompt: { prompt: false } })
  })

  it('requires a server-issued token and caps daily use', () => {
    expect(config.platform_settings.auth.enable_auth).toBe(true)
    expect(config.platform_settings.call_limits.daily_limit).toBeGreaterThan(0)
    expect(config.platform_settings.call_limits.bursting_enabled).toBe(false)
  })
})

describe('VOICES', () => {
  it('offers a few distinct voices, the default one first', () => {
    expect(VOICES.length).toBeGreaterThanOrEqual(3)
    expect(new Set(VOICES.map((voice) => voice.id)).size).toBe(VOICES.length)
    expect(VOICES[0].label).toBe('Markéta')
  })
})
