import { describe, it, expect, vi } from 'vitest'
import { createLimiter } from '@/lib/limiter'

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

describe('createLimiter', () => {
  it('runs tasks up to concurrency limit', async () => {
    const limiter = createLimiter(2)
    let active = 0
    let maxActive = 0

    const run = async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await delay(50)
      active--
    }

    await Promise.all([limiter(run), limiter(run), limiter(run), limiter(run)])
    expect(maxActive).toBeLessThanOrEqual(2)
  })

  it('resolves with the result of the task', async () => {
    const limiter = createLimiter(1)
    const result = await limiter(async () => 42)
    expect(result).toBe(42)
  })

  it('rejects when task throws', async () => {
    const limiter = createLimiter(1)
    await expect(
      limiter(async () => {
        throw new Error('fail')
      }),
    ).rejects.toThrow('fail')
  })

  it('continues processing after rejection', async () => {
    const limiter = createLimiter(1)

    await expect(
      limiter(async () => {
        throw new Error('fail')
      }),
    ).rejects.toThrow('fail')

    const result = await limiter(async () => 'ok')
    expect(result).toBe('ok')
  })

  it('works with concurrency of 1 (serial)', async () => {
    const limiter = createLimiter(1)
    const order: number[] = []

    const t1 = limiter(async () => {
      await delay(30)
      order.push(1)
    })
    const t2 = limiter(async () => {
      order.push(2)
    })

    await Promise.all([t1, t2])
    expect(order).toEqual([1, 2])
  })
})
