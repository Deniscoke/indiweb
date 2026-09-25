// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { controls, conversation, startVoiceCall } = vi.hoisted(() => ({
  controls: { startSession: vi.fn(), endSession: vi.fn(), getOutputVolume: vi.fn(() => 0) },
  conversation: { status: 'disconnected', isSpeaking: false },
  startVoiceCall: vi.fn(),
}))

// The ElevenLabs SDK needs a microphone and WebRTC: stand in for its hooks.
vi.mock('@elevenlabs/react', () => ({
  ConversationProvider: ({ children }: { children: ReactNode }) => children,
  useConversationControls: () => controls,
  useConversationStatus: () => ({ status: conversation.status }),
  useConversationMode: () => ({ isSpeaking: conversation.isSpeaking }),
}))
vi.mock('@/app/actions/start-voice-call', () => ({ startVoiceCall }))

import { VoiceDemo } from '@/components/aria/voice-demo'
import { VOICES } from '@/lib/voice-agent'

beforeEach(() => {
  controls.startSession.mockReset()
  controls.endSession.mockReset()
  startVoiceCall.mockReset()
  conversation.status = 'disconnected'
  conversation.isSpeaking = false
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: vi.fn() }, configurable: true })
})

describe('VoiceDemo', () => {
  it('offers a call with Aria and a choice of voices, Aria first', () => {
    render(<VoiceDemo />)
    expect(screen.getByRole('button', { name: /Promluvit s Ariou/ })).toBeTruthy()
    const voices = screen.getAllByRole('radio')
    expect(voices.map((voice) => voice.getAttribute('value'))).toEqual(VOICES.map((voice) => voice.id))
    expect((voices[0] as HTMLInputElement).checked).toBe(true)
  })

  it('starts a call with a token from our server and the chosen voice', async () => {
    startVoiceCall.mockResolvedValue({ status: 'ready', token: 'conv_1' })
    render(<VoiceDemo />)
    fireEvent.click(screen.getByRole('radio', { name: /Katy/ }))
    fireEvent.click(screen.getByRole('button', { name: /Promluvit s Ariou/ }))

    await waitFor(() => expect(controls.startSession).toHaveBeenCalledTimes(1))
    expect(controls.startSession).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationToken: 'conv_1',
        connectionType: 'webrtc',
        overrides: { tts: { voiceId: VOICES[1].id } },
      }),
    )
  })

  it('explains, and does not start, when the demo is unavailable', async () => {
    startVoiceCall.mockResolvedValue({ status: 'unavailable' })
    render(<VoiceDemo />)
    fireEvent.click(screen.getByRole('button', { name: /Promluvit s Ariou/ }))
    expect(await screen.findByText(/teď není k dispozici/)).toBeTruthy()
    expect(controls.startSession).not.toHaveBeenCalled()
  })

  it('asks to slow down when a visitor starts too many calls', async () => {
    startVoiceCall.mockResolvedValue({ status: 'busy' })
    render(<VoiceDemo />)
    fireEvent.click(screen.getByRole('button', { name: /Promluvit s Ariou/ }))
    expect(await screen.findByText(/za pár minut/)).toBeTruthy()
  })

  it('needs a microphone', async () => {
    Object.defineProperty(navigator, 'mediaDevices', { value: undefined, configurable: true })
    render(<VoiceDemo />)
    fireEvent.click(screen.getByRole('button', { name: /Promluvit s Ariou/ }))
    expect(await screen.findByText(/Povolte ho prosím v prohlížeči/)).toBeTruthy()
    expect(startVoiceCall).not.toHaveBeenCalled()
  })

  it('during a call, shows who is talking, locks the voice and lets you hang up', () => {
    conversation.status = 'connected'
    conversation.isSpeaking = true
    render(<VoiceDemo />)
    expect(screen.getByText('Aria mluví…')).toBeTruthy()
    expect(screen.getAllByRole('radio')[0].matches(':disabled')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /Ukončit hovor/ }))
    expect(controls.endSession).toHaveBeenCalledTimes(1)
  })
})
