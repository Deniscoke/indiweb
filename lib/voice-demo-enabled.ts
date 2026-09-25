/** Whether the live call with Aria is set up (see .env.example); read on the server at build time. */
export function voiceDemoEnabled(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_AGENT_ID)
}
