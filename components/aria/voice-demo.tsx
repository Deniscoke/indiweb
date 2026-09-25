'use client'

import {
  ConversationProvider,
  useConversationControls,
  useConversationMode,
  useConversationStatus,
} from '@elevenlabs/react'
import { useCallback, useRef, useState } from 'react'
import { startVoiceCall } from '@/app/actions/start-voice-call'
import { VoiceDots } from '@/components/aria/voice-dots'
import { cn } from '@/lib/cn'
import { MAX_CALL_SECONDS, VOICES } from '@/lib/voice-agent'

const NOTICES = {
  unavailable: 'Ukázka teď není k dispozici. Zkuste to prosím později, nebo nám rovnou napište.',
  busy: 'To už bylo hodně hovorů za sebou. Zkuste to prosím znovu za pár minut.',
  microphone: 'Na hovor s Ariou je potřeba mikrofon. Povolte ho prosím v prohlížeči.',
  failed: 'Hovor se nepodařilo spojit. Zkontrolujte mikrofon a zkuste to znovu.',
} as const

/** Try Aria live: a voice call with IndiWeb's own agent, right in the browser. */
export function VoiceDemo() {
  return (
    <ConversationProvider>
      <VoiceDemoPanel />
    </ConversationProvider>
  )
}

function VoiceDemoPanel() {
  const { startSession, endSession, getOutputVolume } = useConversationControls()
  const { status } = useConversationStatus()
  const { isSpeaking } = useConversationMode()
  const [voiceId, setVoiceId] = useState(VOICES[0].id)
  const [requesting, setRequesting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [caption, setCaption] = useState<string | null>(null)
  const smoothed = useRef(0)

  const live = status === 'connected'
  const connecting = requesting || status === 'connecting'

  // The dots follow Aria's actual voice while she talks, eased so they breathe rather than flicker.
  const loudness = useCallback(() => {
    if (!live) return undefined
    const target = Math.min(1, getOutputVolume() * 3.2)
    smoothed.current += (target - smoothed.current) * 0.3
    return smoothed.current
  }, [live, getOutputVolume])

  const start = async () => {
    setNotice(null)
    setCaption(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setNotice(NOTICES.microphone)
      return
    }
    setRequesting(true)
    try {
      const call = await startVoiceCall()
      if (call.status !== 'ready') {
        setNotice(NOTICES[call.status])
        return
      }
      startSession({
        conversationToken: call.token,
        connectionType: 'webrtc',
        overrides: { tts: { voiceId } },
        onMessage: ({ message, role }) => {
          if (role === 'agent') setCaption(message)
        },
        onError: (message) => setNotice(/permission|microphone|NotAllowed/i.test(message) ? NOTICES.microphone : NOTICES.failed),
      })
    } catch {
      setNotice(NOTICES.failed)
    } finally {
      setRequesting(false)
    }
  }

  const statusLine = live ? (isSpeaking ? 'Aria mluví…' : 'Poslouchám vás…') : connecting ? 'Spojuji…' : notice

  return (
    <div className="voice-demo">
      <VoiceDots loudness={loudness} />

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <button
          type="button"
          onClick={() => (live ? endSession() : void start())}
          disabled={connecting}
          aria-pressed={live}
          className={cn('voice-demo__call', live && 'is-live')}
        >
          <MicIcon />
          {live ? 'Ukončit hovor' : connecting ? 'Připojuji…' : 'Promluvit s Ariou'}
        </button>
        <p aria-live="polite" className="voice-demo__status min-h-5 max-w-sm text-sm text-fg-dim">
          {statusLine}
        </p>
        {caption && <p className="voice-demo__caption max-w-md text-pretty">„{caption}“</p>}
      </div>

      <fieldset className="mt-8 flex flex-col items-center gap-3" disabled={live || connecting}>
        <legend className="mb-3 w-full text-center font-mono text-xs text-fg-faint">Vyberte hlas</legend>
        <div className="flex flex-wrap justify-center gap-2">
          {VOICES.map((voice) => (
            <label key={voice.id} className="voice-chip" title={voice.description}>
              <input
                type="radio"
                name="aria-voice"
                value={voice.id}
                checked={voiceId === voice.id}
                onChange={() => setVoiceId(voice.id)}
                className="sr-only"
              />
              <span aria-hidden="true" className="voice-chip__dot" />
              {voice.label}
              <span className="sr-only">, {voice.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-6 text-center font-mono text-[0.7rem] leading-relaxed text-fg-faint">
        Živá ukázka přes ElevenLabs · nejvýš {MAX_CALL_SECONDS / 60} minuty · potřebuje mikrofon
      </p>
    </div>
  )
}

function MicIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  )
}
