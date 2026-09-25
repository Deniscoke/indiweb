import { expect, it } from 'vitest'
import { createRateLimiter } from '@/lib/rate-limit'

it('allows a few calls per key within the window, then refuses', () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000 })
  expect(limiter.take('a', 0)).toBe(true)
  expect(limiter.take('a', 10)).toBe(true)
  expect(limiter.take('a', 20)).toBe(false)
  // Other visitors are counted separately.
  expect(limiter.take('b', 20)).toBe(true)
})

it('forgets calls once the window has passed', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000 })
  expect(limiter.take('a', 0)).toBe(true)
  expect(limiter.take('a', 999)).toBe(false)
  expect(limiter.take('a', 1000)).toBe(true)
})

it('does not grow without bound', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 3 })
  for (const key of ['a', 'b', 'c', 'd', 'e']) limiter.take(key, 0)
  expect(limiter.size()).toBeLessThanOrEqual(3)
})
