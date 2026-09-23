import { SERVICE_IDS } from '@/content/types'

// Kept free of zod: the client-side form imports this module.
export const INQUIRY_SERVICES = [...SERVICE_IDS, 'jine'] as const
export type InquiryService = (typeof INQUIRY_SERVICES)[number]

export const INQUIRY_SERVICE_LABELS: Record<InquiryService, string> = {
  web: 'Web',
  '3d': '3D / vizualizace',
  ai: 'AI agent',
  konzultace: 'Konzultace',
  jine: 'Jiné',
}

export function parseServiceParam(value: string | null | undefined): InquiryService | undefined {
  return INQUIRY_SERVICES.find((service) => service === value)
}

export type InquiryField = 'name' | 'email' | 'service' | 'message'
export type InquiryFieldErrors = Partial<Record<InquiryField, string[]>>

export type InquiryState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; fieldErrors: InquiryFieldErrors }
  | { status: 'error' }

export const INITIAL_INQUIRY_STATE: InquiryState = { status: 'idle' }
