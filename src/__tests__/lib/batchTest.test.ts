import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { batchTest } from '@/lib/batchTest'
import type { KeyItem } from '@/lib/types'

vi.mock('@/lib/testKey', () => ({
  testKey: vi.fn(),
}))

import { testKey } from '@/lib/testKey'
const mockedTestKey = vi.mocked(testKey)

function makeItem(id: string, key: string): KeyItem {
  return { id, key, note: '', status: 'idle' }
}

describe('batchTest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onUpdate with testing status then result for each item', async () => {
    const items = [makeItem('1', 'tp-a'), makeItem('2', 'tp-b')]
    mockedTestKey
      .mockResolvedValueOnce({ key: 'tp-a', status: 'success', latency: 100, tokens: 1 })
      .mockResolvedValueOnce({ key: 'tp-b', status: 'error', error: 'invalid_key', latency: 50 })

    const onUpdate = vi.fn()
    const onDone = vi.fn()

    await batchTest(items, 2, onUpdate, onDone)

    // each item: testing + result = 2 calls each
    expect(onUpdate).toHaveBeenCalledTimes(4)
    expect(onUpdate).toHaveBeenCalledWith('1', { status: 'testing' })
    expect(onUpdate).toHaveBeenCalledWith('1', { key: 'tp-a', status: 'success', latency: 100, tokens: 1 })
    expect(onUpdate).toHaveBeenCalledWith('2', { status: 'testing' })
    expect(onUpdate).toHaveBeenCalledWith('2', { key: 'tp-b', status: 'error', error: 'invalid_key', latency: 50 })
  })

  it('calls onDone after all tasks complete', async () => {
    const items = [makeItem('1', 'tp-a')]
    mockedTestKey.mockResolvedValue({ key: 'tp-a', status: 'success', tokens: 1 })

    const onDone = vi.fn()
    await batchTest(items, 1, vi.fn(), onDone)
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('calls onDone even when a task throws', async () => {
    const items = [makeItem('1', 'tp-a')]
    mockedTestKey.mockRejectedValue(new Error('unexpected'))

    const onDone = vi.fn()
    await expect(batchTest(items, 1, vi.fn(), onDone)).rejects.toThrow('unexpected')
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('respects concurrency limit', async () => {
    let active = 0
    let maxActive = 0

    mockedTestKey.mockImplementation(async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await new Promise((r) => setTimeout(r, 10))
      active--
      return { key: 'x', status: 'success' as const, tokens: 1 }
    })

    const items = Array.from({ length: 6 }, (_, i) => makeItem(String(i), `tp-${i}`))
    await batchTest(items, 2, vi.fn(), vi.fn())

    expect(maxActive).toBeLessThanOrEqual(2)
  })
})
