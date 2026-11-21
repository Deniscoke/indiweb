import type { Locale } from '@/lib/i18n'
import { cs, type Privacy, type PrivacyBlock, type PrivacySection } from './cs'
import { de } from './de'
import { en } from './en'

export type { Privacy, PrivacyBlock, PrivacySection }

const notices: Record<Locale, Privacy> = { cs, en, de }

/** The privacy notice in one language. Kept out of the dictionary: only its own page needs it. */
export function getPrivacy(locale: Locale): Privacy {
  return notices[locale]
}
