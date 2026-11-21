'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Dictionary } from '@/content/locales'
import type { Locale } from '@/lib/i18n'

export type I18n = { locale: Locale; dict: Dictionary }

const I18nContext = createContext<I18n | null>(null)

type I18nProviderProps = { locale: Locale; dict: Dictionary; children: ReactNode }

/** Hands the page's language and its texts to client components; set once in the locale layout. */
export function I18nProvider({ locale, dict, children }: I18nProviderProps) {
  const value = useMemo(() => ({ locale, dict }), [locale, dict])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n needs an <I18nProvider> above it (see app/[lang]/layout.tsx).')
  return value
}
