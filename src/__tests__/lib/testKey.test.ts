import { describe, it, expect, vi, afterEach } from 'vitest'
import { testKey } from '@/lib/testKey'

function makeStream(chunks: string[]) {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      controller.close()
    },
  })
}

function mockFetchOk(chunks: string[]) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    body: makeStream(chunks),
  } as Response)
}

describe('testKey', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns success for valid stream with data chunks', async () => {
    global.fetch = mockFetchOk([
      'data: {"choices":[{"delta":{"content":"hi"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" there"}}]}\n\n',
      'data: [DONE]\n\n',
    ])

    const result = await testKey('tp-valid')

    expect(result.status).toBe('success')
    expect(result.key).toBe('tp-valid')
    expect(result.tokens).toBe(2)
    expect(result.latency).toBeGreaterThanOrEqual(0)
    expect(result.firstTokenLatency).toBeGreaterThanOrEqual(0)
  })

  it('handles chunk split across reads (buffer accumulation)', async () => {
    global.fetch = mockFetchOk([
      'data: {"choices":[{"delta":{"content"',
      ':"hi"}}]}\n\ndata: [DONE]\n',
    ])

    const result = await testKey('tp-split')
    expect(result.status).toBe('success')
    expect(result.tokens).toBe(1)
  })

  it('returns error for 401 status', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 } as Response)
    const result = await testKey('tp-bad')
    expect(result.status).toBe('error')
    expect(result.error).toBe('invalid_key')
    expect(result.latency).toBeTypeOf('number')
  })

  it('returns error for 403 status', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403 } as Response)
    const result = await testKey('tp-forbidden')
    expect(result.error).toBe('forbidden')
  })

  it('returns error for 429 status', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 } as Response)
    const result = await testKey('tp-rate')
    expect(result.error).toBe('rate_limit')
  })

  it('returns unknown error for other status codes', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response)
    const result = await testKey('tp-other')
    expect(result.error).toBe('unknown')
  })

  it('returns error when body is null', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, body: null } as Response)
    const result = await testKey('tp-null-body')
    expect(result.status).toBe('error')
    expect(result.error).toBe('unknown')
  })

  it('flushes buffer with trailing data line (no newline)', async () => {
    // last chunk has no trailing \n, so it stays in buffer until flush
    global.fetch = mockFetchOk([
      'data: {"choices":[{"delta":{"content":"x"}}]}\ndata: [DONE]',
    ])
    const result = await testKey('tp-flush')
    expect(result.status).toBe('success')
    expect(result.tokens).toBe(1)
  })

  it('returns error when stream has no data chunks', async () => {
    global.fetch = mockFetchOk([])
    const result = await testKey('tp-empty')
    expect(result.status).toBe('error')
    expect(result.error).toBe('unknown')
  })

  it('filters out data: [DONE] lines', async () => {
    global.fetch = mockFetchOk(['data: [DONE]\n\n'])
    const result = await testKey('tp-done-only')
    expect(result.status).toBe('error')
    expect(result.error).toBe('unknown')
  })

  it('returns timeout error on AbortError', async () => {
    global.fetch = vi.fn().mockRejectedValue(new DOMException('aborted', 'AbortError'))
    const result = await testKey('tp-timeout')
    expect(result.status).toBe('error')
    expect(result.error).toBe('timeout')
  })

  it('returns network error on TypeError', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const result = await testKey('tp-network')
    expect(result.status).toBe('error')
    expect(result.error).toBe('network')
  })

  it('returns unknown error on other exceptions', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('something'))
    const result = await testKey('tp-unknown')
    expect(result.status).toBe('error')
    expect(result.error).toBe('unknown')
  })

  it('measures latency values', async () => {
    global.fetch = mockFetchOk([
      'data: {"choices":[{"delta":{"content":"x"}}]}\n\n',
      'data: [DONE]\n',
    ])
    const result = await testKey('tp-latency')
    expect(result.latency).toBeTypeOf('number')
    expect(result.firstTokenLatency).toBeTypeOf('number')
  })
})
