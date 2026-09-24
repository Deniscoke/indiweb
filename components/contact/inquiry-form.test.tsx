// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
    render(<InquiryForm />)
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
      website: '',
    })
    expect(screen.queryByRole('form', { name: 'Poptávkový formulář' })).toBeNull()
  })

  it('shows field errors and keeps everything the visitor typed', async () => {
    sendInquiryMock.mockResolvedValue({
      status: 'invalid',
      fieldErrors: { email: ['Zadejte platný e-mail.'] },
    })
    render(<InquiryForm />)
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
    render(<InquiryForm />)
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
    render(<InquiryForm presetService="ai" />)
    expect(select().value).toBe('ai')
    fireEvent.change(select(), { target: { value: 'web' } })
    expect(select().value).toBe('web')
  })

  it('hides the honeypot from keyboard users', () => {
    const { container } = render(<InquiryForm />)
    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement
    expect(honeypot.tabIndex).toBe(-1)
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})

describe('InquiryFormWithParams', () => {
  it('preselects the service from ?sluzba=', () => {
    searchParamsMock.mockReturnValue(new URLSearchParams('sluzba=ai'))
    render(<InquiryFormWithParams />)
    expect(select().value).toBe('ai')
  })

  it('ignores an unknown ?sluzba= value', () => {
    searchParamsMock.mockReturnValue(new URLSearchParams('sluzba=eshop'))
    render(<InquiryFormWithParams />)
    expect(select().value).toBe('')
  })
})
