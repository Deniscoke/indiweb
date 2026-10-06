import { INQUIRY_SERVICE_LABELS } from '@/lib/inquiry-options'
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

export function buildInquiryEmail(inquiry: Inquiry, to: string): InquiryEmail {
  const service = inquiry.service ? INQUIRY_SERVICE_LABELS[inquiry.service] : 'Neuvedeno'
  return {
    from: INQUIRY_EMAIL_FROM,
    to: [to],
    replyTo: inquiry.email,
    subject: `Nová poptávka — ${singleLine(inquiry.name)} (${service})`,
    text: [
      `Jméno: ${inquiry.name}`,
      `E-mail: ${inquiry.email}`,
      `Služba: ${service}`,
      '',
      'Zpráva:',
      inquiry.message,
    ].join('\n'),
  }
}
