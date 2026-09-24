import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { PROJECT_IMAGE_SIZE, projects } from '@/content/projects'
import { media } from '@/content/site'

const publicFile = (src: string) => join(process.cwd(), 'public', src)
const MAX_BYTES = 400 * 1024

describe('project screenshots', () => {
  it.each(projects.map((p) => [p.slug, p.image] as const))(
    '%s has a 1440×900 WebP screenshot under 400 KB',
    async (_slug, image) => {
      const file = publicFile(image)
      expect(existsSync(file)).toBe(true)
      const { width, height, format } = await sharp(file).metadata()
      expect({ width, height, format }).toEqual({ ...PROJECT_IMAGE_SIZE, format: 'webp' })
      expect(statSync(file).size).toBeLessThan(MAX_BYTES)
    },
  )
})

describe('media', () => {
  it.each(Object.entries(media))('%s matches its declared size', async (_key, item) => {
    const file = publicFile(item.src)
    expect(existsSync(file)).toBe(true)
    const { width, height, format } = await sharp(file).metadata()
    expect({ width, height, format }).toEqual({ width: item.width, height: item.height, format: 'webp' })
    expect(statSync(file).size).toBeLessThan(MAX_BYTES)
  })
})
