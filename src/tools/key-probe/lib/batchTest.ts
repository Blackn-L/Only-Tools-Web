import type { KeyItem } from './types'
import { testKey } from './testKey'
import { createLimiter } from './limiter'

export async function batchTest(
  items: KeyItem[],
  concurrency: number,
  onUpdate: (id: string, data: Partial<KeyItem>) => void,
  onDone: () => void,
): Promise<void> {
  const limiter = createLimiter(concurrency)

  const tasks = items.map((item) =>
    limiter(async () => {
      onUpdate(item.id, { status: 'testing' })
      const result = await testKey(item.key, item.baseUrl, item.model, item.protocol)
      onUpdate(item.id, result)
      return result
    }),
  )

  try {
    await Promise.all(tasks)
  } finally {
    onDone()
  }
}
