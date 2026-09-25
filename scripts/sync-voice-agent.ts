// Uploads the voice demo agent (lib/voice-agent.ts) to ElevenLabs.
//   npm run voice:sync
// Creates the agent the first time (then add the printed ID to .env.local and
// Vercel as ELEVENLABS_AGENT_ID); afterwards updates it with the current
// content of the site, so the agent always knows what the site says.
import { VOICES, voiceAgentConfig } from '@/lib/voice-agent'

const API = 'https://api.elevenlabs.io/v1/convai/agents'

/**
 * Every voice a visitor can pick must exist in the account and be usable by
 * agents: voices whose owner turned on live moderation make the call fail.
 */
async function checkVoices(apiKey: string) {
  for (const voice of VOICES) {
    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voice.id}`, { headers: { 'xi-api-key': apiKey } })
    if (!response.ok) throw new Error(`Voice ${voice.label} (${voice.id}) is not in the account: ${response.status}`)
    const details = (await response.json()) as { sharing?: { live_moderation_enabled?: boolean } }
    if (details.sharing?.live_moderation_enabled) {
      throw new Error(`Voice ${voice.label} (${voice.id}) has live moderation, which agents cannot use. Pick another voice.`)
    }
  }
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not set (add it to .env.local)')
  await checkVoices(apiKey)

  const response = await fetch(agentId ? `${API}/${agentId}` : `${API}/create`, {
    method: agentId ? 'PATCH' : 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(voiceAgentConfig()),
  })
  const body = await response.text()
  if (!response.ok) throw new Error(`ElevenLabs answered ${response.status}: ${body}`)

  if (agentId) {
    console.log(`Updated agent ${agentId}.`)
  } else {
    const { agent_id: created } = JSON.parse(body) as { agent_id: string }
    console.log(`Created agent ${created}.\nAdd ELEVENLABS_AGENT_ID=${created} to .env.local and to Vercel.`)
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
