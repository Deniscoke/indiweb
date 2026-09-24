'use server'

import { Resend } from 'resend'
import { site } from '@/content/site'
import { buildInquiryEmail } from '@/lib/inquiry-email'
import type { InquiryState } from '@/lib/inquiry-options'
import { isHoneypotFilled, parseInquiry } from '@/lib/inquiry-schema'

export async function sendInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Bots fill the hidden field; report success so they do not retry.
  if (isHoneypotFilled(formData)) return { status: 'success' }

  const parsed = parseInquiry(formData)
  if (!parsed.success) return { status: 'invalid', fieldErrors: parsed.fieldErrors }

  // Read the key per request: the Resend constructor throws when it is missing.
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[sendInquiry] RESEND_API_KEY is not set')
    return { status: 'error' }
  }

  try {
    // Resend returns API failures as { error } instead of throwing.
    const { error } = await new Resend(apiKey).emails.send(
      buildInquiryEmail(parsed.data, site.email),
    )
    if (error) {
      console.error('[sendInquiry] Resend rejected the e-mail', error)
      return { status: 'error' }
    }
    return { status: 'success' }
  } catch (error) {
    console.error('[sendInquiry] Sending failed', error)
    return { status: 'error' }
  }
}
