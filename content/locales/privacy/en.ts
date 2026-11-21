import { TRANSCRIPT_RETENTION_DAYS } from '@/lib/voice-agent'
import type { Privacy } from './cs'

/** The privacy notice (GDPR art. 13) in English. Same sections and blocks as the Czech source. */
export const en: Privacy = {
  metaTitle: 'Privacy Notice',
  metaDescription: 'What data the IndiWeb website processes, why, for how long, and what rights you have.',
  eyebrow: 'Legal information',
  title: 'Privacy Notice',
  effective: 'Effective from {date}',
  updated: 'October 6, 2026',
  authority:
    'If you believe we are not handling your data in accordance with the law, you may lodge a complaint with the supervisory authority: the Office for Personal Data Protection (Úřad pro ochranu osobních údajů, ÚOOÚ), Pplk. Sochora 27, 170 00 Prague 7, Czech Republic,',
  authorityAfter: '.',
  intro:
    'This page explains what data about you we process when you visit the IndiWeb website, why, for how long, and what rights you have. We try to collect only what we actually need.',
  sections: [
    {
      title: 'Who processes your data',
      body: [
        {
          p: 'The controller of your personal data is Denis Mitrović, who runs the IndiWeb website together with Adam and Ondra. For anything concerning your data, you can contact us by email at:',
        },
        { contact: true },
      ],
    },
    {
      title: 'Inquiry form',
      body: [
        {
          p: 'When you send us an inquiry, we process your name, email address, the service you selected, and the text of your message so that we can reply to you and prepare a quote. The legal basis is taking steps at your request prior to entering into a contract (Art. 6(1)(b) GDPR).',
        },
        {
          p: 'Your message reaches us by email through the Resend service, and we store it in a Gmail (Google) mailbox. If we do not end up working together, we delete the inquiry within 12 months at the latest.',
        },
      ],
    },
    {
      title: 'Aria voice demo',
      body: [
        {
          p: 'You start a call with Aria yourself by pressing the “Talk to Aria” button. Your voice is processed in real time by the ElevenLabs service, which converts it to text and generates Aria’s reply using a language model. The legal basis is your consent, which you give by starting the call (Art. 6(1)(a) GDPR). You can end the call at any time.',
        },
        {
          p: `No audio recording of your voice is stored. The transcript of the conversation is kept by ElevenLabs for ${TRANSCRIPT_RETENTION_DAYS} days so that we can see what visitors ask about, and is then deleted automatically. Please do not share any sensitive information during the call.`,
        },
      ],
    },
    {
      title: '3D tour (Splatoo)',
      body: [
        {
          p: 'The 3D tour section displays content from the Splatoo service and loads only once you scroll to it on the page. When it does, Splatoo receives technical data about your browser, such as your IP address. Visits to the tour are measured only with your consent, given in the banner inside the tour itself; the operator of Splatoo is responsible for that measurement.',
        },
      ],
    },
    {
      title: 'Website operation and cookies',
      body: [
        {
          p: 'The website is hosted by Vercel, which processes technical data (IP address, browser type, time) on every visit to keep the site secure and reliable. The legal basis is our legitimate interest (Art. 6(1)(f) GDPR).',
        },
        {
          p: 'We measure traffic with Vercel Web Analytics so that we know how many people visit the website and which pages they read. It does not use cookies, it does not track you across websites, and we see the results only as aggregate figures, not per individual visitor. The legal basis is our legitimate interest (Art. 6(1)(f) GDPR).',
        },
        {
          p: 'We do not use any cookies or advertising tools ourselves. Your browser only remembers, for the duration of your visit, that you have already seen the intro animation, so that it does not play again.',
        },
      ],
    },
    {
      title: 'Who else has access to the data',
      body: [
        {
          list: [
            'Vercel Inc. (USA) — website hosting and traffic measurement',
            'Resend, Inc. (USA) — delivery of the email sent from the form',
            'Google LLC (USA) — the Gmail mailbox',
            'Eleven Labs Inc. (USA) — the Aria voice demo',
            'Splatoo — the 3D tour (an independent controller)',
          ],
        },
        {
          p: 'As a result, your data may be transferred outside the EU, to the United States. Such transfers take place on the basis of the EU–U.S. Data Privacy Framework or the standard contractual clauses approved by the European Commission. We do not sell your data to anyone.',
        },
      ],
    },
    {
      title: 'Your rights',
      body: [
        {
          list: [
            'to know what data we hold about you and to receive a copy of it',
            'to have inaccurate data corrected',
            'to have your data erased or its processing restricted',
            'to object to processing based on legitimate interest',
            'to receive your data in a machine-readable format',
            'to withdraw your consent at any time, without affecting processing carried out before the withdrawal',
          ],
        },
        { p: 'Just write to us at the email address above. We will reply within one month at the latest.' },
      ],
    },
    {
      title: 'Complaint to the supervisory authority',
      body: [{ authority: true }],
    },
  ],
}
