// The live voice demo in the Aria section: an ElevenLabs agent that speaks for
// IndiWeb. Its prompt is built from the site's own content, so it knows exactly
// what the site says; `npm run voice:sync` uploads this configuration.
import { aria } from '@/content/aria'
import { processSteps } from '@/content/process'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { splatShowcase } from '@/content/splat'
import { team } from '@/content/team'

export type Voice = { id: string; label: string; description: string }

/**
 * Voices a visitor can try: native Czech professional voices from the IndiWeb
 * ElevenLabs account, which sound far more natural in Czech than the English
 * premade ones. Visitors hear Aria in any of them; the first is her default.
 */
export const VOICES: Voice[] = [
  { id: 'Nr9bRiFsgPeaoVggMD2V', label: 'Markéta', description: 'Jasný, příjemný ženský hlas' },
  { id: 'ULC9TU2vv6WOHN6tKxNv', label: 'Katy', description: 'Mladý, přirozený ženský hlas' },
  { id: 'uYFJyGaibp4N2VwYQshk', label: 'Marek', description: 'Sametový, klidný mužský hlas' },
  { id: 'pt8Kvp57SW3o4WuGqWZG', label: 'Kuba', description: 'Uvolněný mužský hlas' },
]

/** One demo call may last this long, so the credits last for many visitors. */
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

## 3D a spolupráce se Splatoo
${bullets(splatShowcase.collaboration)}
Na tomto webu je živá 3D prohlídka sálu zámku ve Žďáru nad Sázavou (sekce „3D“), kterou si návštěvník může sám projít.

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
        prompt: { prompt: voiceAgentPrompt(), llm: 'claude-haiku-4-5', temperature: 0.4 },
      },
      // Tuned for Markéta: steady but alive, a touch slower than default.
      tts: {
        voice_id: VOICES[0].id,
        model_id: 'eleven_turbo_v2_5',
        stability: 0.7,
        similarity_boost: 0.8,
        speed: 0.96,
      },
      conversation: { max_duration_seconds: MAX_CALL_SECONDS },
    },
    platform_settings: {
      // Conversations need a token from our server, which holds the API key.
      auth: { enable_auth: true },
      // No bursting: past the limits calls are refused, never billed at the burst rate.
      call_limits: { daily_limit: DAILY_CALL_LIMIT, agent_concurrency_limit: 3, bursting_enabled: false },
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
