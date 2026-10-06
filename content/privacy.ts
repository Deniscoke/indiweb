import { site } from '@/content/site'
import { TRANSCRIPT_RETENTION_DAYS } from '@/lib/voice-agent'

/** A paragraph, a list, the controller's e-mail, or the data protection authority. */
export type PrivacyBlock = { p: string } | { list: string[] } | { contact: true } | { authority: true }

export type PrivacySection = { title: string; body: PrivacyBlock[] }

/**
 * The privacy notice (GDPR art. 13). Keep it true to how the site works: the
 * voice transcript retention comes from the agent's own setting.
 */
export const privacy = {
  updated: '6. 10. 2026',
  controller: { name: 'Denis Mitrović', email: site.email },
  intro:
    'Na této stránce najdete, jaké údaje o vás při návštěvě webu IndiWeb zpracováváme, proč, jak dlouho a jaká máte práva. Snažíme se sbírat jen to, co opravdu potřebujeme.',
  sections: [
    {
      title: 'Kdo vaše údaje zpracovává',
      body: [
        {
          p: 'Správcem osobních údajů je Denis Mitrović, který provozuje web IndiWeb společně s Adamem a Ondrou. Se vším, co se týká vašich údajů, se můžete obrátit na e-mail:',
        },
        { contact: true },
      ],
    },
    {
      title: 'Poptávkový formulář',
      body: [
        {
          p: 'Když nám pošlete poptávku, zpracováváme vaše jméno, e-mail, vybranou službu a text zprávy, abychom vám mohli odpovědět a připravit nabídku. Právním základem je jednání o smlouvě na vaši žádost (čl. 6 odst. 1 písm. b GDPR).',
        },
        {
          p: 'Zpráva k nám dorazí e-mailem přes službu Resend a uložíme ji ve schránce Gmail (Google). Pokud spolupráce nevznikne, poptávku smažeme nejpozději do 12 měsíců.',
        },
      ],
    },
    {
      title: 'Hlasová ukázka Arie',
      body: [
        {
          p: 'Hovor s Ariou spouštíte sami tlačítkem „Promluvit s Ariou“. Váš hlas se v reálném čase zpracuje ve službě ElevenLabs, která ho převede na text a vytvoří Ariinu odpověď pomocí jazykového modelu. Právním základem je váš souhlas, který dáváte spuštěním hovoru (čl. 6 odst. 1 písm. a GDPR). Hovor můžete kdykoli ukončit.',
        },
        {
          p: `Zvukový záznam vašeho hlasu se neukládá. Přepis rozhovoru se u ElevenLabs uchovává ${TRANSCRIPT_RETENTION_DAYS} dní, abychom viděli, na co se návštěvníci ptají, a poté se automaticky smaže. Do hovoru prosím neříkejte citlivé údaje.`,
        },
      ],
    },
    {
      title: '3D prohlídka (Splatoo)',
      body: [
        {
          p: 'Sekce s 3D prohlídkou zobrazuje obsah ze služby Splatoo a načte se, až když k ní na stránce dojdete. Splatoo přitom získá technické údaje o vašem prohlížeči, například IP adresu. Měření návštěvnosti prohlídky probíhá jen s vaším souhlasem v liště přímo v prohlídce; za něj odpovídá provozovatel Splatoo.',
        },
      ],
    },
    {
      title: 'Provoz webu a cookies',
      body: [
        {
          p: 'Web běží na hostingu Vercel, který při každé návštěvě zpracovává technické údaje (IP adresu, typ prohlížeče, čas) kvůli bezpečnému a spolehlivému provozu. Právním základem je náš oprávněný zájem (čl. 6 odst. 1 písm. f GDPR).',
        },
        {
          p: 'Návštěvnost měříme nástrojem Vercel Web Analytics, abychom věděli, kolik lidí web navštíví a které stránky čtou. Nepoužívá cookies, nesleduje vás napříč weby a výsledky vidíme jen jako souhrnná čísla, nikoli po jednotlivých návštěvnících. Právním základem je náš oprávněný zájem (čl. 6 odst. 1 písm. f GDPR).',
        },
        {
          p: 'Sami nepoužíváme žádné cookies ani reklamní nástroje. Prohlížeč si jen během návštěvy pamatuje, že jste už viděli úvodní animaci, aby se vám nespouštěla znovu.',
        },
      ],
    },
    {
      title: 'Kdo další má k údajům přístup',
      body: [
        {
          list: [
            'Vercel Inc. (USA) — hosting webu a měření návštěvnosti',
            'Resend, Inc. (USA) — doručení e-mailu z formuláře',
            'Google LLC (USA) — e-mailová schránka Gmail',
            'Eleven Labs Inc. (USA) — hlasová ukázka Arie',
            'Splatoo — 3D prohlídka (samostatný správce)',
          ],
        },
        {
          p: 'Údaje se tak mohou dostat mimo EU, do USA. Děje se to na základě rámce EU–USA pro ochranu osobních údajů (Data Privacy Framework) nebo standardních smluvních doložek schválených Evropskou komisí. Vaše údaje nikomu neprodáváme.',
        },
      ],
    },
    {
      title: 'Vaše práva',
      body: [
        {
          list: [
            'vědět, jaké údaje o vás máme, a dostat jejich kopii',
            'nechat nepřesné údaje opravit',
            'nechat údaje smazat nebo omezit jejich zpracování',
            'vznést námitku proti zpracování z oprávněného zájmu',
            'získat údaje ve strojově čitelné podobě',
            'kdykoli odvolat souhlas, aniž by to ovlivnilo zpracování před odvoláním',
          ],
        },
        { p: 'Stačí nám napsat na e-mail výše. Odpovíme nejpozději do jednoho měsíce.' },
      ],
    },
    {
      title: 'Stížnost u dozorového úřadu',
      body: [{ authority: true }],
    },
  ] satisfies PrivacySection[],
}
