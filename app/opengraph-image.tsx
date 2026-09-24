import { ImageResponse } from 'next/og'

export const alt = 'IndiWeb — weby, 3D a AI agenti'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
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
          background: '#08080a',
          backgroundImage: 'radial-gradient(60% 60% at 50% 0%, rgba(120,130,255,0.35), transparent 70%)',
          color: '#f4f4f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: 40, fontWeight: 600 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: '#ffffff' }} />
          IndiWeb
        </div>
        <div style={{ marginTop: 40, fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          Weby, 3D a AI agenti
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: '#a0a0aa' }}>Denis, Adam a Ondra</div>
      </div>
    ),
    size,
  )
}
