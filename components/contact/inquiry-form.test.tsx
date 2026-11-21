// @vitest-environment jsdom
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '@/test/render'

const { sendInquiryMock, searchParamsMock } = vi.hoisted(() => ({
  sendInquiryMock: vi.fn(),
  searchParamsMock: vi.fn(() => new URLSearchParams()),
}))

vi.mock('@/app/actions/send-inquiry', () => ({ sendInquiry: sendInquiryMock }))
vi.mock('next/navigation', () => ({ useSearchParams: searchParamsMock }))

import { InquiryForm, InquiryFormWithParams } from '@/components/contact/inquiry-form'

const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement
const select = () => screen.getByLabelText(/O co máte zájem/) as HTMLSelectElement

function fillValid() {
  fireEvent.change(input('Jméno'), { target: { value: 'Jana Nováková' } })
  fireEvent.change(input('E-mail'), { target: { value: 'jana@example.cz' } })
  fireEvent.change(input('Váš projekt'), { target: { value: 'Potřebujeme nový web pro kavárnu.' } })
}

const submit = () => fireEvent.submit(screen.getByRole('form', { name: 'Poptávkový formulář' }))

describe('InquiryForm', () => {
  it('sends the filled-in fields to the server action', async () => {
    sendInquiryMock.mockResolvedValue({ status: 'success' })
    renderWithI18n(<InquiryForm />)
    fillValid()
    fireEvent.change(select(), { target: { value: 'ai' } })
    submit()

    expect(await screen.findByText('Díky, zpráva dorazila.')).toBeTruthy()
    const formData = sendInquiryMock.mock.calls[0][1] as FormData
    expect(Object.fromEntries(formData)).toEqual({
      name: 'Jana Nováková',
      email: 'jana@example.cz',
      service: 'ai',
      message: 'Potřebujeme nový web pro kavárnu.',
      company_url_2: '',
      locale: 'cs',
    })
    expect(screen.queryByRole('form', { name: 'Poptávkový formulář' })).toBeNull()
  })

  it('shows field errors and keeps everything the visitor typed', async () => {
    sendInquiryMock.mockResolvedValue({
      status: 'invalid',
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
    renderWithI18n(<InquiryForm />)
    fillValid()
    submit()

    expect(await screen.findByText('Zadejte platný e-mail.')).toBeTruthy()
    expect(input('E-mail').getAttribute('aria-invalid')).toBe('true')
    expect(input('Jméno').value).toBe('Jana Nováková')
    expect(input('Váš projekt').value).toBe('Potřebujeme nový web pro kavárnu.')
  })

  it('offers the e-mail address and a copy button when sending fails', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    sendInquiryMock.mockResolvedValue({ status: 'error' })
    renderWithI18n(<InquiryForm />)
    fillValid()
    submit()

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('Odeslání se nepovedlo.')
    expect(screen.getByRole('link', { name: 'info.indiweb@gmail.com' }).getAttribute('href')).toBe(
      'mailto:info.indiweb@gmail.com',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Zkopírovat zprávu' }))
    expect(await screen.findByRole('button', { name: 'Zpráva zkopírována' })).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith('Potřebujeme nový web pro kavárnu.')
  })

  it('preselects a service and lets the visitor change it', () => {
    renderWithI18n(<InquiryForm presetService="ai" />)
    expect(select().value).toBe('ai')
    fireEvent.change(select(), { target: { value: 'web' } })
    expect(select().value).toBe('web')
  })

  it('hides the honeypot from keyboard users', () => {
    const { container } = renderWithI18n(<InquiryForm />)
    const honeypot = container.querySelector('input[name="company_url_2"]') as HTMLInputElement
    expect(honeypot.tabIndex).toBe(-1)
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('focuses the success message on success', async () => {
    sendInquiryMock.mockResolvedValue({ status: 'success' })
    renderWithI18n(<InquiryForm />)
    fillValid()
    submit()

    // Focus moves in an effect after the message renders, so wait for it.
    const status = await screen.findByRole('status')
    await waitFor(() => expect(document.activeElement).toBe(status))
  })

  it('focuses the first invalid field, in name/email/service/message order', async () => {
    sendInquiryMock.mockResolvedValue({
      status: 'invalid',
      fieldErrors: { message: ['Napište nám zprávu.'], email: ['Zadejte platný e-mail.'] },
    })
    renderWithI18n(<InquiryForm />)
    fillValid()
    submit()

    await screen.findByText('Zadejte platný e-mail.')
    await waitFor(() => expect(document.activeElement).toBe(input('E-mail')))
  })
})

describe('InquiryFormWithParams', () => {
  it('preselects the service from ?sluzba=', () => {
    searchParamsMock.mockReturnValue(new URLSearchParams('sluzba=ai'))
    renderWithI18n(<InquiryFormWithParams />)
    expect(select().value).toBe('ai')
  })

  it('ignores an unknown ?sluzba= value', () => {
    searchParamsMock.mockReturnValue(new URLSearchParams('sluzba=eshop'))
    renderWithI18n(<InquiryFormWithParams />)
    expect(select().value).toBe('')
  })

  it('sends the page language along, so the server answers in it', async () => {
    sendInquiryMock.mockResolvedValue({ status: 'success' })
    renderWithI18n(<InquiryForm />, 'de')
    fireEvent.submit(screen.getByRole('form'))
    await screen.findByRole('status')
    expect((sendInquiryMock.mock.calls.at(-1)?.[1] as FormData).get('locale')).toBe('de')
  })

  it('tells, next to the send button, how the inquiry is handled', () => {
    renderWithI18n(<InquiryForm />)
    expect(screen.getByRole('link', { name: 'Zásady ochrany osobních údajů' }).getAttribute('href')).toBe('/ochrana-osobnich-udaju')
  })
})
