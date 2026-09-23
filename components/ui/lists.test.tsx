// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BulletList } from '@/components/ui/bullet-list'
import { StepList } from '@/components/ui/step-list'
import { TagList } from '@/components/ui/tag-list'

describe('BulletList', () => {
  it('renders one list item per entry', () => {
    render(<BulletList items={['Rezervace', 'E-shop']} />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Rezervace', 'E-shop'])
  })
})

describe('TagList', () => {
  it('renders a labelled list of tags', () => {
    render(<TagList tags={['Web', 'B2B']} />)
    const list = screen.getByRole('list', { name: 'Štítky' })
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Web', 'B2B'])
  })
})

describe('StepList', () => {
  it('renders an ordered list with a heading per step', () => {
    const steps = [
      { title: 'Poptávka', text: 'Napíšete nám.' },
      { title: 'Návrh', text: 'Navrhneme řešení.' },
    ]
    const { container } = render(<StepList steps={steps} />)
    expect(container.querySelector('ol')).not.toBeNull()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Poptávka',
      'Návrh',
    ])
    expect(screen.getByText('Navrhneme řešení.')).toBeTruthy()
  })
})
