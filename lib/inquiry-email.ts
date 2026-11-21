import { cs } from '@/content/locales/cs'
import { LOCALE_NAMES, type Locale } from '@/lib/i18n'
import type { Inquiry } from '@/lib/inquiry-schema'

// Sent from indiweb.cz, verified in Resend (SPF and DKIM in the domain's DNS on
// Vercel). Replies go straight to the visitor through replyTo.
export const INQUIRY_EMAIL_FROM = 'IndiWeb <poptavky@indiweb.cz>'

export type InquiryEmail = {
  from: string
  to: string[]
  replyTo: string
  subject: string
  text: string
}

const singleLine = (value: string) => value.replace(/\s+/g, ' ').trim()

/** The e-mail to the team: always in Czech, with the visitor's language so we know how to answer. */
export function buildInquiryEmail(inquiry: Inquiry, to: string, locale: Locale): InquiryEmail {
  const service = inquiry.service ? cs.contact.form.services[inquiry.service] : 'Neuvedeno'
  return {
    from: INQUIRY_EMAIL_FROM,
    to: [to],
    replyTo: inquiry.email,
    subject: `Nová poptávka — ${singleLine(inquiry.name)} (${service})`,
    text: [
      `Jméno: ${singleLine(inquiry.name)}`,
      `E-mail: ${inquiry.email}`,
      `Služba: ${service}`,
      `Jazyk návštěvníka: ${LOCALE_NAMES[locale]} (${locale})`,
      '',
      'Zpráva:',
      inquiry.message,
    ].join('\n'),
  }
}
