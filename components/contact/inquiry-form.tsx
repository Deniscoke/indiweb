'use client'

import { useSearchParams } from 'next/navigation'
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { sendInquiry } from '@/app/actions/send-inquiry'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'
import {
  INITIAL_INQUIRY_STATE,
  INQUIRY_SERVICE_LABELS,
  INQUIRY_SERVICES,
  parseServiceParam,
  type InquiryField,
  type InquiryService,
} from '@/lib/inquiry-options'

// Underlined fields on black: the line lights up in the accent when focused.
const CONTROL =
  'w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-fg transition-colors placeholder:text-fg-faint focus:border-accent focus:outline-hidden focus-visible:shadow-[0_1px_0_0_rgb(217_184_255)]'

// Order in which fields are focused when the server action reports validation errors.
const FIELD_FOCUS_ORDER: InquiryField[] = ['name', 'email', 'service', 'message']

type FieldProps = {
  id: InquiryField
  label: string
  optional?: boolean
  error?: string
  children: ReactNode
}

function Field({ id, label, optional, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-mono text-xs text-fg-dim">
        {label}
        {optional && <span className="text-fg-faint"> (nepovinné)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-chyba`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function InquiryFormWithParams() {
  const searchParams = useSearchParams()
  return <InquiryForm presetService={parseServiceParam(searchParams.get('sluzba'))} />
}

export function InquiryForm({ presetService }: { presetService?: InquiryService }) {
  const [state, formAction, pending] = useActionState(sendInquiry, INITIAL_INQUIRY_STATE)
  const [chosenService, setChosenService] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const serviceRef = useRef<HTMLSelectElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const service = chosenService ?? presetService ?? ''
  const errors = state.status === 'invalid' ? state.fieldErrors : {}
  const errorOf = (field: InquiryField) => errors[field]?.[0]
  const controlProps = (field: InquiryField) => ({
    'aria-invalid': Boolean(errorOf(field)),
    'aria-describedby': errorOf(field) ? `${field}-chyba` : undefined,
    className: cn(CONTROL, errorOf(field) ? 'border-danger' : 'border-line'),
  })

  useEffect(() => {
    if (state.status === 'success') successRef.current?.focus()
  }, [state])

  useEffect(() => {
    if (state.status !== 'invalid') return
    const firstInvalid = FIELD_FOCUS_ORDER.find((field) => state.fieldErrors[field]?.[0])
    switch (firstInvalid) {
      case 'name':
        nameRef.current?.focus()
        break
      case 'email':
        emailRef.current?.focus()
        break
      case 'service':
        serviceRef.current?.focus()
        break
      case 'message':
        messageRef.current?.focus()
        break
    }
  }, [state])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // A native form action would reset every field when the action returns,
    // even on a validation error. Dispatching manually keeps what was typed.
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setCopied(false)
    startTransition(() => formAction(formData))
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(messageRef.current?.value ?? '')
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-2xl border border-success/30 bg-success/10 p-6 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent/40"
      >

        <p className="font-display text-xl font-semibold">Díky, zpráva dorazila.</p>
        <p className="mt-2 text-fg-dim">Ozveme se vám do 24 hodin na e-mail, který jste uvedli.</p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      aria-label="Poptávkový formulář"
      className="relative grid gap-8"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" label="Jméno" error={errorOf('name')}>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            {...controlProps('name')}
          />
        </Field>
        <Field id="email" label="E-mail" error={errorOf('email')}>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            {...controlProps('email')}
          />
        </Field>
      </div>

      <Field id="service" label="O co máte zájem" optional error={errorOf('service')}>
        <select
          ref={serviceRef}
          id="service"
          name="service"
          value={service}
          onChange={(event) => setChosenService(event.target.value)}
          {...controlProps('service')}
        >
          <option value="">Vyberte službu</option>
          {INQUIRY_SERVICES.map((id) => (
            <option key={id} value={id}>
              {INQUIRY_SERVICE_LABELS[id]}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Váš projekt" error={errorOf('message')}>
        <textarea
          ref={messageRef}
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          {...controlProps('message')}
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="company_url_2">Web (nevyplňujte)</label>
        <input
          id="company_url_2"
          name="company_url_2"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-fg px-7 py-3.5 text-sm font-medium text-bg transition-[background-color,box-shadow] hover:bg-white hover:shadow-[0_0_36px_4px_rgb(217_184_255/0.4)] disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Odesílám…' : 'Odeslat poptávku'}
        </button>
      </div>

      <div aria-live="polite">
        {state.status === 'error' && (
          <div role="alert" className="rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm">
            <p className="font-medium text-fg">Odeslání se nepovedlo.</p>
            <p className="mt-1 text-fg-dim">
              Zkuste to prosím znovu, nebo nám napište přímo na{' '}
              <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={copyMessage}
              className="mt-3 rounded-full border border-line-strong px-4 py-2 text-fg transition-colors hover:bg-surface"
            >
              {copied ? 'Zpráva zkopírována' : 'Zkopírovat zprávu'}
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
