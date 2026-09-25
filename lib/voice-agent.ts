// The live voice demo in the Aria section: an ElevenLabs agent that speaks for
// IndiWeb. Its prompt is built from the site's own content, so it knows exactly
// what the site says; `npm run voice:sync` uploads this configuration.
import { aria } from '@/content/aria'
import { processSteps } from '@/content/process'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { team } from '@/content/team'

export type Voice = { id: string; label: string; description: string }

/**
 * Voices a visitor can try, from the ElevenLabs premade library (free to use).
 * The first is Aria's own voice and the agent's default.
 */
export const VOICES: Voice[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Aria', description: 'Klidný, vlídný ženský hlas' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', label: 'Laura', description: 'Svěží, energický ženský hlas' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice', description: 'Věcný, sebejistý ženský hlas' },
  { id: 'onwK4e9ZLuTAKqWW03F9', label: 'Daniel', description: 'Hluboký, rozvážný mužský hlas' },
]

/** One demo call may last this long, to keep the free credits for many visitors. */
export const MAX_CALL_SECONDS = 180
/** And the agent takes at most this many calls a day. */
const DAILY_CALL_LIMIT = 40

const FIRST_MESSAGE =
  'Dobrý den, tady Aria z IndiWebu. Jsem hlasová AI asistentka a ráda vám povím, co děláme. S čím vám můžu pomoct?'

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join('\n')

/** The system prompt: who Aria is, what IndiWeb offers, and how to talk on the phone. */
export function voiceAgentPrompt(): string {
  const offer = services
    .map((service) => `${service.title}: ${service.summary}\n${bullets(service.points)}`)
    .join('\n\n')
  const steps = processSteps.map((step, index) => `${index + 1}. ${step.title} — ${step.text}`).join('\n')
  const people = team.map((member) => `- ${member.name} (${member.role}): ${member.bio}`).join('\n')

  return `# Kdo jsi
Jsi Aria, hlasová AI asistentka studia IndiWeb. Mluvíš s návštěvníky webu, kteří si tě právě zkouší. Jsi zároveň živou ukázkou produktu Aria — hlasového agenta, kterého IndiWeb nasazuje firmám na telefon.

# Jak mluvíš
- Mluvíš česky, přirozeně a vlídně, jako na telefonu. Rozumíš i slovensky; odpovídáš česky.
- Odpovídáš krátce: jedna až tři věty. Nečti seznamy, vyber to podstatné a nabídni víc, když o to návštěvník stojí.
- Ptáš se na potřeby návštěvníka (jakou má firmu, co by potřeboval) a doporučíš, která služba dává smysl.
- Nevymýšlej si nic, co není níže — hlavně ceny, termíny, reference ani jména klientů. Cenu IndiWeb řekne předem po krátké nezávazné konzultaci.
- Když návštěvník projeví zájem, nasměruj ho na formulář „Napište nám“ na tomto webu nebo na e-mail ${site.email}. Tým se ozve do 24 hodin.
- Když se ptá na něco mimo IndiWeb, přátelsky to vrať zpět k tomu, s čím můžeš pomoct.
- Na otázku, jestli jsi člověk, řekni po pravdě, že jsi AI.
- Nežádej žádné citlivé údaje (hesla, čísla karet, rodná čísla).

# IndiWeb
${site.name} je malé studio tří kluků, kteří tvoří weby na míru, 3D a AI. Zákazník mluví přímo s nimi, bez prostředníků.

## Služby
${offer}

## Aria (produkt)
${aria.description}
${bullets(aria.capabilities)}
Hodí se pro:
${bullets(aria.audience)}

## Jak spolupráce probíhá
${steps}

## Tým
${people}

## Kontakt
E-mail: ${site.email}. Formulář „Napište nám“ je na konci této stránky.`
}

/** The agent's full ElevenLabs configuration (Agents API, snake_case as sent). */
export function voiceAgentConfig() {
  return {
    name: 'IndiWeb — Aria (ukázka na webu)',
    conversation_config: {
      agent: {
        first_message: FIRST_MESSAGE,
        language: 'cs',
        max_conversation_duration_message:
          'Tahle ukázka má omezenou délku, takže se musím rozloučit. Napište nám přes formulář a ozveme se. Hezký den!',
        prompt: { prompt: voiceAgentPrompt(), temperature: 0.4 },
      },
      tts: { voice_id: VOICES[0].id, model_id: 'eleven_flash_v2_5' },
      conversation: { max_duration_seconds: MAX_CALL_SECONDS },
    },
    platform_settings: {
      // Conversations need a token from our server, which holds the API key.
      auth: { enable_auth: true },
      call_limits: { daily_limit: DAILY_CALL_LIMIT, agent_concurrency_limit: 3 },
      // The browser may pick a voice; it may never rewrite what the agent says.
      overrides: {
        conversation_config_override: {
          agent: { first_message: false, language: false, prompt: { prompt: false } },
          tts: { voice_id: true },
        },
      },
    },
  }
}
