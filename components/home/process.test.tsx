// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Process } from '@/components/home/process'
import { processSteps } from '@/content/process'

it('lists the four steps in order', () => {
  render(<Process />)
  const items = within(screen.getByRole('list')).getAllByRole('listitem')
  expect(items).toHaveLength(4)
  processSteps.forEach((step, index) => {
    expect(within(items[index]).getByRole('heading', { level: 3, name: step.title })).toBeTruthy()
  })
})
