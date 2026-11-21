import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'

/** The language of a page in app/[lang], from its route params; an unknown one is a 404. */
export async function pageLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return lang
}
