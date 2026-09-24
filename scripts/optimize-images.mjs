// Converts the source photos in assets-src/ to WebP files in public/media/.
// Usage: node scripts/optimize-images.mjs
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const SOURCES = [
  { input: 'assets-src/macbook.png', output: 'public/media/macbook.webp' },
  { input: 'assets-src/phone.png', output: 'public/media/phone.webp' },
]

await mkdir('public/media', { recursive: true })

for (const { input, output } of SOURCES) {
  const info = await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output)
  console.log(`${output}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`)
}
