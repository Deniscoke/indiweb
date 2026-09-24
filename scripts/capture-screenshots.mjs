// Captures a 1440x900 screenshot of each site with the locally installed
// Microsoft Edge and saves it as public/projects/<slug>.webp.
// Usage: node scripts/capture-screenshots.mjs <slug>=<url> [<slug>=<url> ...]
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const VIEWPORT = { width: 1440, height: 900 }
const OUT_DIR = join('public', 'projects')

const targets = process.argv.slice(2).map((arg) => {
  const eq = arg.indexOf('=')
  if (eq < 1) throw new Error(`Invalid argument "${arg}", expected <slug>=<url>`)
  return { slug: arg.slice(0, eq), url: arg.slice(eq + 1) }
})

if (targets.length === 0) {
  console.error('Usage: node scripts/capture-screenshots.mjs <slug>=<url> ...')
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })

try {
  const context = await browser.newContext({ viewport: VIEWPORT, locale: 'cs-CZ' })
  for (const { slug, url } of targets) {
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    // Some sites open with an intro screen that Enter dismisses; harmless elsewhere.
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3_000)
    await page.mouse.move(0, 0)
    const png = await page.screenshot({ type: 'png' })
    const file = join(OUT_DIR, `${slug}.webp`)
    await sharp(png).webp({ quality: 80 }).toFile(file)
    console.log(`saved ${file}`)
    await page.close()
  }
} finally {
  await browser.close()
}
