'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { useI18n } from '@/components/i18n/i18n-provider'
import { cn } from '@/lib/cn'
import { LOCALE_NAMES, LOCALES, switchLocalePath, toPublicPath } from '@/lib/i18n'

type LanguageSwitcherProps = { className?: string; onNavigate?: () => void }

/** CS / EN / DE: the page the visitor is on, in each language. */
export function LanguageSwitcher({ className, onNavigate }: LanguageSwitcherProps) {
  const { locale, dict } = useI18n()
  // The route inside app/[lang] is the same on the server and in the browser;
  // the address bar is not, because the proxy rewrites Czech and translated paths.
  const segments = useSelectedLayoutSegments()
  const current = toPublicPath(`/${[locale, ...segments].join('/')}`)

  return (
    <nav aria-label={dict.header.languages} className={className}>
      <ul className="flex items-center gap-1 font-mono text-xs">
        {LOCALES.map((target) => (
          <li key={target}>
            {/* A plain link: the other language is another document, with its own <html lang>. */}
            <a
              href={switchLocalePath(current, target)}
              hrefLang={target}
              lang={target}
              title={LOCALE_NAMES[target]}
              aria-label={LOCALE_NAMES[target]}
              aria-current={target === locale ? 'true' : undefined}
              onClick={onNavigate}
              className={cn(
                'inline-block px-1.5 py-3 uppercase underline-offset-4 transition-colors hover:text-fg',
                target === locale ? 'text-accent' : 'text-fg-faint',
              )}
            >
              {target}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
