import { expect, it } from 'vitest'
import { cn } from '@/lib/cn'

it('joins truthy class names and skips the rest', () => {
  expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
})
