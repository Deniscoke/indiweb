import { describe, expect, it } from 'vitest'
import { buildInquiryEmail } from '@/lib/inquiry-email'
import type { Inquiry } from '@/lib/inquiry-schema'

const inquiry: Inquiry = {
  name: 'Jana Nováková',
  email: 'jana@example.cz',
  service: 'ai',
  message: 'Chceme Ariu.\nDruhý řádek.',
}

describe('buildInquiryEmail', () => {
  it('sends to our inbox and replies go to the visitor', () => {
    expect(buildInquiryEmail(inquiry, 'info.indiweb@gmail.com')).toEqual({
      from: 'IndiWeb <onboarding@resend.dev>',
      to: ['info.indiweb@gmail.com'],
      replyTo: 'jana@example.cz',
      subject: 'Nová poptávka — Jana Nováková (AI agent)',
      text: 'Jméno: Jana Nováková\nE-mail: jana@example.cz\nSlužba: AI agent\n\nZpráva:\nChceme Ariu.\nDruhý řádek.',
    })
  })

  it('says "Neuvedeno" when no service was chosen', () => {
    const email = buildInquiryEmail({ ...inquiry, service: undefined }, 'info.indiweb@gmail.com')
    expect(email.subject).toBe('Nová poptávka — Jana Nováková (Neuvedeno)')
    expect(email.text).toContain('Služba: Neuvedeno')
  })

  it('keeps the subject on a single line', () => {
    const email = buildInquiryEmail({ ...inquiry, name: 'Jana\r\nBcc: x@y.cz' }, 'info.indiweb@gmail.com')
    expect(email.subject).toBe('Nová poptávka — Jana Bcc: x@y.cz (AI agent)')
  })
})
