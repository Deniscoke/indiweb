import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))

vi.mock('resend', () => ({
  Resend: vi.fn(
    class {
      emails = { send: sendMock }
    },
  ),
}))

import { sendInquiry } from '@/app/actions/send-inquiry'
import { INITIAL_INQUIRY_STATE } from '@/lib/inquiry-options'

function inquiryForm(overrides: Record<string, string> = {}) {
  const values = {
    name: 'Jana Nováková',
    email: 'jana@example.cz',
    service: 'web',
    message: 'Potřebujeme nový web pro kavárnu.',
    website: '',
    ...overrides,
  }
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) formData.set(key, value)
  return formData
}

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 're_test_123')
  sendMock.mockReset()
  sendMock.mockResolvedValue({ data: { id: 'email_1' }, error: null, headers: null })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('sendInquiry', () => {
  it('e-mails a valid inquiry to the IndiWeb inbox', async () => {
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'success',
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['info.indiweb@gmail.com'],
        replyTo: 'jana@example.cz',
        subject: 'Nová poptávka — Jana Nováková (Web)',
      }),
    )
  })

  it('returns field errors and sends nothing for invalid input', async () => {
    const state = await sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm({ email: 'spatne' }))
    expect(state).toEqual({
      status: 'invalid',
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('pretends success for bots that fill the honeypot', async () => {
    await expect(
      sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm({ website: 'https://spam.example' })),
    ).resolves.toEqual({ status: 'success' })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('fails gracefully when the API key is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', undefined)
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'error',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('reports an error when Resend rejects the e-mail', async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { name: 'validation_error', message: 'bad', statusCode: 422 },
      headers: null,
    })
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'error',
    })
  })

  it('reports an error when sending throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('network down'))
    await expect(sendInquiry(INITIAL_INQUIRY_STATE, inquiryForm())).resolves.toEqual({
      status: 'error',
    })
  })
})
