// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithI18n } from '@/test/render'
import { Process } from '@/components/home/process'
import { cs } from '@/content/locales/cs'

it('lists the four steps in order', () => {
  renderWithI18n(<Process />)
  const items = within(screen.getByRole('list')).getAllByRole('listitem')
  expect(items).toHaveLength(4)
  cs.process.steps.forEach((step, index) => {
    expect(within(items[index]).getByRole('heading', { level: 3, name: step.title })).toBeTruthy()
  })
})
