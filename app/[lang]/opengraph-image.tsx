import { ImageResponse } from 'next/og'
import { getDictionary } from '@/content/locales'
import { site } from '@/content/site'
import { DEFAULT_LOCALE, isLocale, LOCALES } from '@/lib/i18n'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Drawn once per language at build time.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

// The share picture, with its words in the page's language.
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const { shareImage } = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE).site
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          // The site's look: pure black, the intro's lilac light falling from above.
          background: '#000000',
          backgroundImage:
            'radial-gradient(55% 70% at 72% 0%, rgba(217,184,255,0.55), rgba(167,126,230,0.18) 45%, transparent 75%)',
          color: '#ecebf0',
          position: 'relative',
        }}
      >
        {/* The glass rim from the intro, as a thin line of refracted light. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 110,
            height: 2,
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(217,184,255,0.9), transparent)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: 40, fontWeight: 600 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: '#ffffff' }} />
          {site.name}
        </div>
        <div style={{ marginTop: 40, fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          {shareImage.headline}
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: '#a19ea9' }}>{shareImage.tagline}</div>
      </div>
    ),
    size,
  )
}
