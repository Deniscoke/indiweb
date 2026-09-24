import { describe, expect, it } from 'vitest'
import { SERVICE_IDS } from '@/content/types'
import { INQUIRY_SERVICE_LABELS, INQUIRY_SERVICES, parseServiceParam } from '@/lib/inquiry-options'

describe('INQUIRY_SERVICES', () => {
  it('offers every service plus "jine"', () => {
    expect(INQUIRY_SERVICES).toEqual([...SERVICE_IDS, 'jine'])
  })

  it('has a Czech label for every option', () => {
    expect(Object.keys(INQUIRY_SERVICE_LABELS).sort()).toEqual([...INQUIRY_SERVICES].sort())
  })
})

describe('parseServiceParam', () => {
  it.each(['web', '3d', 'ai', 'konzultace', 'jine'])('accepts %s', (value) => {
    expect(parseServiceParam(value)).toBe(value)
  })

  it.each([null, undefined, '', 'eshop', 'AI'])('ignores %s', (value) => {
    expect(parseServiceParam(value)).toBeUndefined()
  })
})
