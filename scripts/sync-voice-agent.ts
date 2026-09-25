// Uploads the voice demo agent (lib/voice-agent.ts) to ElevenLabs.
//   npm run voice:sync
// Creates the agent the first time (then add the printed ID to .env.local and
// Vercel as ELEVENLABS_AGENT_ID); afterwards updates it with the current
// content of the site, so the agent always knows what the site says.
import { voiceAgentConfig } from '@/lib/voice-agent'

const API = 'https://api.elevenlabs.io/v1/convai/agents'

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not set (add it to .env.local)')

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
