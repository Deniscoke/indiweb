import { describe, expect, it } from 'vitest'
import { getDictionary } from '@/content/locales'
import { SERVICE_IDS } from '@/content/types'
import { LOCALES } from '@/lib/i18n'
import { INQUIRY_SERVICES, parseServiceParam } from '@/lib/inquiry-options'

describe('INQUIRY_SERVICES', () => {
  it('offers every service plus "jine"', () => {
    expect(INQUIRY_SERVICES).toEqual([...SERVICE_IDS, 'jine'])
  })

  it.each(LOCALES)('has a label for every option in %s', (locale) => {
    const labels = getDictionary(locale).contact.form.services
    expect(Object.keys(labels).sort()).toEqual([...INQUIRY_SERVICES].sort())
    expect(getDictionary('cs').contact.form.services.ai).toBe('AI agent')
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
