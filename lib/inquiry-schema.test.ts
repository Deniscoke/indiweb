import { describe, expect, it } from 'vitest'
import { isHoneypotFilled, parseInquiry } from '@/lib/inquiry-schema'

function form(values: Record<string, string>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) formData.set(key, value)
  return formData
}

const valid = {
  name: 'Jana Nováková',
  email: 'jana@example.cz',
  service: 'web',
  message: 'Potřebujeme nový web pro kavárnu.',
}

describe('parseInquiry', () => {
  it('accepts a valid inquiry', () => {
    expect(parseInquiry(form(valid))).toEqual({ success: true, data: valid })
  })

  it('trims whitespace around name and e-mail', () => {
    const result = parseInquiry(form({ ...valid, name: '  Jana Nováková ', email: ' jana@example.cz  ' }))
    expect(result).toEqual({ success: true, data: valid })
  })

  it('treats an empty service as not chosen', () => {
    const result = parseInquiry(form({ ...valid, service: '' }))
    expect(result).toEqual({ success: true, data: { ...valid, service: undefined } })
  })

  it('treats a missing service field as not chosen', () => {
    const formData = form(valid)
    formData.delete('service')
    expect(parseInquiry(formData)).toEqual({ success: true, data: { ...valid, service: undefined } })
  })

  it('rejects an unknown service', () => {
    expect(parseInquiry(form({ ...valid, service: 'eshop' }))).toEqual({
      success: false,
      fieldErrors: { service: ['Vyberte službu ze seznamu.'] },
    })
  })

  it('reports every missing required field', () => {
    expect(parseInquiry(new FormData())).toEqual({
      success: false,
      fieldErrors: {
        name: ['Vyplňte jméno.'],
        email: ['Vyplňte e-mail.'],
        message: ['Napište nám zprávu.'],
      },
    })
  })

  it('rejects an invalid e-mail', () => {
    expect(parseInquiry(form({ ...valid, email: 'jana(at)example.cz' }))).toEqual({
      success: false,
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
  })

  it('rejects a one-letter name', () => {
    expect(parseInquiry(form({ ...valid, name: 'J' }))).toEqual({
      success: false,
      fieldErrors: { name: ['Jméno musí mít alespoň 2 znaky.'] },
    })
  })

  it('rejects a name over 100 characters', () => {
    expect(parseInquiry(form({ ...valid, name: 'a'.repeat(101) }))).toEqual({
      success: false,
      fieldErrors: { name: ['Jméno může mít nejvýše 100 znaků.'] },
    })
  })

  it('rejects a message under 10 characters', () => {
    expect(parseInquiry(form({ ...valid, message: 'Ahoj' }))).toEqual({
      success: false,
      fieldErrors: { message: ['Zpráva musí mít alespoň 10 znaků.'] },
    })
  })

  it('accepts a message of exactly 5000 characters', () => {
    expect(parseInquiry(form({ ...valid, message: 'a'.repeat(5000) })).success).toBe(true)
  })

  it('rejects a message over 5000 characters', () => {
    expect(parseInquiry(form({ ...valid, message: 'a'.repeat(5001) }))).toEqual({
      success: false,
      fieldErrors: { message: ['Zpráva může mít nejvýše 5000 znaků.'] },
    })
  })
})

describe('isHoneypotFilled', () => {
  it('is false when the hidden field is missing or blank', () => {
    expect(isHoneypotFilled(new FormData())).toBe(false)
    expect(isHoneypotFilled(form({ website: '   ' }))).toBe(false)
  })

  it('is true when a bot filled the hidden field', () => {
    expect(isHoneypotFilled(form({ website: 'https://spam.example' }))).toBe(true)
  })
})
