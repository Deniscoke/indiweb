import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { getDictionary } from '@/content/locales'
import { NAV_SECTIONS, site } from '@/content/site'
import { localizedPath, type Locale } from '@/lib/i18n'

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const home = localizedPath(locale, { name: 'home' })
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 text-sm text-fg-dim sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs">
          © {year} {site.name}. {dict.footer.tagline}
        </p>
        <nav aria-label={dict.footer.nav}>
          <ul className="flex flex-wrap gap-x-6">
            {NAV_SECTIONS.map((section) => (
              <li key={section}>
                <Link href={`${home}#${section}`} className="inline-block py-3 hover:text-fg">
                  {dict.nav[section]}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="inline-block py-3 hover:text-fg">
                {site.email}
              </a>
            </li>
            <li>
              <Link href={localizedPath(locale, { name: 'privacy' })} className="inline-block py-3 hover:text-fg">
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
