import { INQUIRY_SERVICE_LABELS } from '@/lib/inquiry-options'
import type { Inquiry } from '@/lib/inquiry-schema'

// Resend's shared test sender; it can deliver only to the Resend account owner
// (info.indiweb@gmail.com). Switch to a verified domain once indiweb.cz exists.
export const INQUIRY_EMAIL_FROM = 'IndiWeb <onboarding@resend.dev>'

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
