type RateLimiterOptions = { limit: number; windowMs: number; maxKeys?: number }

export type RateLimiter = {
  /** Records a call for `key`; false when the key has used up its calls in the window. */
  take: (key: string, now?: number) => boolean
  size: () => number
}

/**
 * A small in-memory sliding-window limiter. It lives per server instance, so it
 * is a speed bump against one visitor hammering an endpoint, not a hard quota.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }: RateLimiterOptions): RateLimiter {
  const calls = new Map<string, number[]>()

  return {
    take(key, now = Date.now()) {
      const recent = (calls.get(key) ?? []).filter((time) => now - time < windowMs)
      const allowed = recent.length < limit
      if (allowed) recent.push(now)
      // Re-inserting moves the key to the end, so the oldest keys are evicted first.
      calls.delete(key)
      calls.set(key, recent)
      while (calls.size > maxKeys) calls.delete(calls.keys().next().value as string)
      return allowed
    },
    size: () => calls.size,
  }
}
