import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { navigation, site } from '@/content/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 text-sm text-fg-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. Tvoříme s péčí.
        </p>
        <nav aria-label="Patička">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                {site.email}
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
