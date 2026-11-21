import type { GateLanguage } from '@/components/intro/intro-gate'
import { LOCALE_NAMES, LOCALES, type Locale } from '@/lib/i18n'
import { cs, type Dictionary } from './cs'
import { de } from './de'
import { en } from './en'

export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { cs, en, de }

/** Every text of the site in one language. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** The intro's entrance asks in every language at once: its few words, per language. */
export function introGate(): GateLanguage[] {
  return LOCALES.map((locale) => {
    const { choose, enter, withSound } = dictionaries[locale].intro
    return { locale, name: LOCALE_NAMES[locale], choose, enter, withSound }
  })
}
