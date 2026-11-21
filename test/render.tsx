import { render, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { I18nProvider } from '@/components/i18n/i18n-provider'
import { getDictionary } from '@/content/locales'
import type { Locale } from '@/lib/i18n'

/** Renders a component the way the locale layout does: inside the language's dictionary. */
export function renderWithI18n(ui: ReactElement, locale: Locale = 'cs'): RenderResult {
  return render(
    <I18nProvider locale={locale} dict={getDictionary(locale)}>
      {ui}
    </I18nProvider>,
  )
}
