// The intro's ambient soundtrack, synthesised live with Web Audio: no audio file
// to download or license. A warm D add9 pad opens up with the light, a breath of
// air rises under it, and glassy high notes ring in with the wordmark, all sent
// through a long generated reverb. lib/intro-sound.ts holds the score.
import { introSoundScore } from '@/lib/intro-sound'

export type IntroSound = {
  /** Follows the score at this many seconds into the intro. */
  update: (elapsed: number) => void
  /** Lets the sound ring out over about this many seconds, then shuts it down. */
  release: (seconds?: number) => void
}

const PEAK_GAIN = 0.45
/** D add9 spread over three octaves: warm at the bottom, open at the top. */
const PAD_NOTES = [73.42, 110, 146.83, 185, 220, 329.63]
/** A, D and F sharp two octaves up: the glass catching the light. */
const SHIMMER_NOTES = [880, 1174.66, 1479.98]
/** The pad's filter opens from here (muffled) up to 12× (clear) with the light. */
const FILTER_BASE_HZ = 200
/** Parameter changes glide over roughly this long (seconds), so nothing clicks. */
const GLIDE = 0.25
/** How often the score is sampled (ms); gliding covers the gaps. */
const UPDATE_EVERY_MS = 60

type AudioContextClass = typeof AudioContext

/** A stereo room: noise that dies away over `seconds`. */
function reverbImpulse(context: AudioContext, seconds: number): AudioBuffer {
  const length = Math.round(context.sampleRate * seconds)
  const buffer = context.createBuffer(2, length, context.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.8
  }
  return buffer
}

function whiteNoise(context: AudioContext, seconds: number): AudioBuffer {
  const buffer = context.createBuffer(1, Math.round(context.sampleRate * seconds), context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** Starts the soundtrack (silent until the first update). Null where Web Audio is missing. */
export function createIntroSound(): IntroSound | null {
  const Context: AudioContextClass | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextClass }).webkitAudioContext
  if (!Context) return null

  const context = new Context()
  void context.resume()
  const sources: AudioScheduledSourceNode[] = []

  const master = context.createGain()
  master.gain.value = 0
  master.connect(context.destination)

  const reverb = context.createConvolver()
  reverb.buffer = reverbImpulse(context, 4.5)
  const wet = context.createGain()
  wet.gain.value = 0.6
  reverb.connect(wet).connect(master)

  // The pad: two slightly detuned voices per note for a slow, living chorus.
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 0.7
  filter.frequency.value = FILTER_BASE_HZ
  const pad = context.createGain()
  pad.gain.value = 0.55
  filter.connect(pad)
  pad.connect(master)
  pad.connect(reverb)
  PAD_NOTES.forEach((frequency, index) => {
    for (const detune of [-6, 6]) {
      const voice = context.createOscillator()
      voice.type = index < 2 ? 'sine' : 'triangle'
      voice.frequency.value = frequency
      voice.detune.value = detune
      const gain = context.createGain()
      gain.gain.value = 0.15 / (1 + index * 0.35)
      voice.connect(gain).connect(filter)
      sources.push(voice)
    }
  })
  // The filter breathes slowly, like the light's shimmer on the glass.
  const breath = context.createOscillator()
  breath.frequency.value = 0.08
  const breathDepth = context.createGain()
  breathDepth.gain.value = 90
  breath.connect(breathDepth).connect(filter.frequency)
  sources.push(breath)

  // Air: soft band-passed noise under the chord.
  const air = context.createBufferSource()
  air.buffer = whiteNoise(context, 3)
  air.loop = true
  const airFilter = context.createBiquadFilter()
  airFilter.type = 'bandpass'
  airFilter.frequency.value = 900
  airFilter.Q.value = 0.5
  const airGain = context.createGain()
  airGain.gain.value = 0
  air.connect(airFilter).connect(airGain)
  airGain.connect(master)
  airGain.connect(reverb)
  sources.push(air)

  // Shimmer: high sines that swell in and out at their own slow pace, mostly reverb.
  const shimmer = context.createGain()
  shimmer.gain.value = 0
  shimmer.connect(reverb)
  const shimmerDry = context.createGain()
  shimmerDry.gain.value = 0.25
  shimmer.connect(shimmerDry).connect(master)
  SHIMMER_NOTES.forEach((frequency, index) => {
    const tone = context.createOscillator()
    tone.frequency.value = frequency
    const gain = context.createGain()
    gain.gain.value = 0.03
    const swell = context.createOscillator()
    swell.frequency.value = 0.21 + index * 0.13
    const swellDepth = context.createGain()
    swellDepth.gain.value = 0.025
    swell.connect(swellDepth).connect(gain.gain)
    tone.connect(gain).connect(shimmer)
    sources.push(tone, swell)
  })

  for (const source of sources) source.start()

  let released = false
  let lastUpdate = -Infinity
  const glide = (param: AudioParam, value: number) => param.setTargetAtTime(value, context.currentTime, GLIDE)

  return {
    update(elapsed) {
      const now = performance.now()
      if (released || now - lastUpdate < UPDATE_EVERY_MS) return
      lastUpdate = now
      const score = introSoundScore(elapsed)
      glide(master.gain, score.level * PEAK_GAIN)
      glide(filter.frequency, FILTER_BASE_HZ * 12 ** score.brightness)
      glide(airGain.gain, 0.015 + 0.05 * score.brightness)
      glide(shimmer.gain, score.shimmer)
    },
    release(seconds = 2.4) {
      if (released) return
      released = true
      const now = context.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      // An exponential-like decay, the way a real room lets a chord die away.
      master.gain.setTargetAtTime(0, now, seconds / 4)
      window.setTimeout(
        () => {
          for (const source of sources) source.stop()
          void context.close()
        },
        (seconds + 0.3) * 1000,
      )
    },
  }
}
