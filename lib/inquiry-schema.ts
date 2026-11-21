import * as z from 'zod'
import type { Dictionary } from '@/content/locales'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n'
import { INQUIRY_SERVICES, type InquiryFieldErrors } from '@/lib/inquiry-options'

export type InquiryMessages = Dictionary['contact']['form']['errors']

// FormData gives null for a missing field and '' for an empty <select>.
const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value)

/** The inquiry's rules, with the error messages in the visitor's language. */
export function inquirySchema(messages: InquiryMessages) {
  return z.object({
    name: z
      .string({ error: messages.nameRequired })
      .trim()
      .min(2, { error: messages.nameTooShort })
      .max(100, { error: messages.nameTooLong }),
    email: z
      .string({ error: messages.emailRequired })
      .trim()
      .pipe(z.email({ error: messages.emailInvalid })),
    service: z.preprocess(
      emptyToUndefined,
      z.enum(INQUIRY_SERVICES, { error: messages.serviceInvalid }).optional(),
    ),
    message: z
      .string({ error: messages.messageRequired })
      .trim()
      .min(10, { error: messages.messageTooShort })
      .max(5000, { error: messages.messageTooLong }),
  })
}

export type Inquiry = z.infer<ReturnType<typeof inquirySchema>>

export type ParseInquiryResult =
  | { success: true; data: Inquiry }
  | { success: false; fieldErrors: InquiryFieldErrors }

export function parseInquiry(formData: FormData, messages: InquiryMessages): ParseInquiryResult {
  const result = inquirySchema(messages).safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message'),
  })
  if (result.success) return { success: true, data: result.data }
  return { success: false, fieldErrors: z.flattenError(result.error).fieldErrors }
}

/** The language the form was sent from; anything but a known language counts as Czech. */
export function inquiryLocale(formData: FormData): Locale {
  const value = formData.get('locale')
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get('company_url_2')
  return typeof value === 'string' && value.trim() !== ''
}
