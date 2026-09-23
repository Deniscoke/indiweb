import * as z from 'zod'
import { INQUIRY_SERVICES, type InquiryFieldErrors } from '@/lib/inquiry-options'

// FormData gives null for a missing field and '' for an empty <select>.
const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value)

export const inquirySchema = z.object({
  name: z
    .string({ error: 'Vyplňte jméno.' })
    .trim()
    .min(2, { error: 'Jméno musí mít alespoň 2 znaky.' })
    .max(100, { error: 'Jméno může mít nejvýše 100 znaků.' }),
  email: z
    .string({ error: 'Vyplňte e-mail.' })
    .trim()
    .pipe(z.email({ error: 'Zadejte platný e-mail.' })),
  service: z.preprocess(
    emptyToUndefined,
    z.enum(INQUIRY_SERVICES, { error: 'Vyberte službu ze seznamu.' }).optional(),
  ),
  message: z
    .string({ error: 'Napište nám zprávu.' })
    .trim()
    .min(10, { error: 'Zpráva musí mít alespoň 10 znaků.' })
    .max(5000, { error: 'Zpráva může mít nejvýše 5000 znaků.' }),
})

export type Inquiry = z.infer<typeof inquirySchema>

export type ParseInquiryResult =
  | { success: true; data: Inquiry }
  | { success: false; fieldErrors: InquiryFieldErrors }

export function parseInquiry(formData: FormData): ParseInquiryResult {
  const result = inquirySchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message'),
  })
  if (result.success) return { success: true, data: result.data }
  return { success: false, fieldErrors: z.flattenError(result.error).fieldErrors }
}

export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get('website')
  return typeof value === 'string' && value.trim() !== ''
}
