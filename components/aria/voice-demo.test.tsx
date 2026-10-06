// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type SessionOptions = {
  onStatusChange?: (event: { status: string }) => void
  onModeChange?: (event: { mode: string }) => void
  onMessage?: (event: { message: string; role: string }) => void
}

const { sdkLoaded, startSession, session, startVoiceCall } = vi.hoisted(() => ({
  sdkLoaded: vi.fn(),
  startSession: vi.fn(),
  session: { endSession: vi.fn(async () => {}), getOutputVolume: vi.fn(() => 0) },
  startVoiceCall: vi.fn(),
}))

// The ElevenLabs SDK needs a microphone and WebRTC: stand in for it, and note when it is loaded.
vi.mock('@elevenlabs/client', () => {
  sdkLoaded()
  return { VoiceConversation: { startSession } }
})
vi.mock('@/app/actions/start-voice-call', () => ({ startVoiceCall }))

import { VoiceDemo } from '@/components/aria/voice-demo'
import { VOICES } from '@/lib/voice-agent'

const callButton = () => screen.getByRole('button', { name: /Promluvit s Ariou/ })

beforeEach(() => {
  startSession.mockReset()
  startSession.mockResolvedValue(session)
  session.endSession.mockClear()
  startVoiceCall.mockReset()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: vi.fn() }, configurable: true })
})

/** Starts a call and returns the callbacks the demo handed to the SDK. */
async function startCall(): Promise<SessionOptions> {
  startVoiceCall.mockResolvedValue({ status: 'ready', token: 'conv_1' })
  fireEvent.click(callButton())
  await waitFor(() => expect(startSession).toHaveBeenCalledTimes(1))
  return startSession.mock.calls[0][0] as SessionOptions
}

describe('VoiceDemo', () => {
  it('offers a call with Aria and a choice of voices, the default first', () => {
    render(<VoiceDemo />)
    expect(callButton()).toBeTruthy()
    const voices = screen.getAllByRole('radio')
    expect(voices.map((voice) => voice.getAttribute('value'))).toEqual(VOICES.map((voice) => voice.id))
    expect((voices[0] as HTMLInputElement).checked).toBe(true)
  })

  it('downloads the voice SDK only once a visitor starts a call', async () => {
    render(<VoiceDemo />)
    expect(sdkLoaded).not.toHaveBeenCalled()
    await startCall()
    expect(sdkLoaded).toHaveBeenCalled()
  })

  it('starts a call with a token from our server and the chosen voice', async () => {
    render(<VoiceDemo />)
    fireEvent.click(screen.getByRole('radio', { name: /Katy/ }))
    await startCall()
    expect(startSession).toHaveBeenCalledWith(
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
    fireEvent.click(callButton())
    expect(await screen.findByText(/teď není k dispozici/)).toBeTruthy()
    expect(startSession).not.toHaveBeenCalled()
  })

  it('asks to slow down when a visitor starts too many calls', async () => {
    startVoiceCall.mockResolvedValue({ status: 'busy' })
    render(<VoiceDemo />)
    fireEvent.click(callButton())
    expect(await screen.findByText(/za pár minut/)).toBeTruthy()
  })

  it('needs a microphone', async () => {
    Object.defineProperty(navigator, 'mediaDevices', { value: undefined, configurable: true })
    render(<VoiceDemo />)
    fireEvent.click(callButton())
    expect(await screen.findByText(/Povolte ho prosím v prohlížeči/)).toBeTruthy()
    expect(startVoiceCall).not.toHaveBeenCalled()
  })

  it('explains when the call cannot connect (e.g. the microphone was refused)', async () => {
    startSession.mockRejectedValue(new Error('Permission denied'))
    render(<VoiceDemo />)
    startVoiceCall.mockResolvedValue({ status: 'ready', token: 'conv_1' })
    fireEvent.click(callButton())
    expect(await screen.findByText(/Povolte ho prosím v prohlížeči/)).toBeTruthy()
  })

  it('during a call, shows who is talking and her words, locks the voice and lets you hang up', async () => {
    render(<VoiceDemo />)
    const events = await startCall()
    act(() => {
      events.onStatusChange?.({ status: 'connected' })
      events.onModeChange?.({ mode: 'speaking' })
      events.onMessage?.({ message: 'Dobrý den, tady Aria.', role: 'agent' })
    })
    expect(screen.getByText('Aria mluví…')).toBeTruthy()
    expect(screen.getByText(/Dobrý den, tady Aria\./)).toBeTruthy()
    expect(screen.getAllByRole('radio')[0].matches(':disabled')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /Ukončit hovor/ }))
    expect(session.endSession).toHaveBeenCalledTimes(1)
    act(() => events.onStatusChange?.({ status: 'disconnected' }))
    expect(callButton()).toBeTruthy()
  })
})
