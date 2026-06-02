import type { KeyError, TestResult } from './types'

const TIMEOUT_MS = 10_000
const PROXY_URL = import.meta.env.VITE_API_PROXY_URL || ''

function classifyError(status?: number, err?: unknown): KeyError {
  if (status === 401) return 'invalid_key'
  if (status === 403) return 'forbidden'
  if (status === 429) return 'rate_limit'
  if (err instanceof DOMException && err.name === 'AbortError') return 'timeout'
  if (err instanceof TypeError) return 'network'
  return 'unknown'
}

function buildChatCompletionsUrl(baseUrl: string) {
  const target = `${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`
  return PROXY_URL ? `${PROXY_URL}${encodeURIComponent(target)}` : target
}

function buildBody(model: string) {
  return JSON.stringify({
    model,
    messages: [{ role: 'user', content: 'Reply with one word: hi' }],
    stream: true,
    max_tokens: 20,
  })
}

export async function testKey(key: string, baseUrl: string, model: string): Promise<TestResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const startTime = performance.now()

  try {
    const res = await fetch(buildChatCompletionsUrl(baseUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: buildBody(model),
      signal: controller.signal,
    })

    if (!res.ok) {
      clearTimeout(timer)
      return {
        key,
        status: 'error',
        error: classifyError(res.status),
        latency: performance.now() - startTime,
      }
    }

    if (!res.body) {
      clearTimeout(timer)
      return {
        key,
        status: 'error',
        error: 'unknown',
        latency: performance.now() - startTime,
      }
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let firstTokenTime: number | undefined
    let tokens = 0
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      if (!firstTokenTime) {
        firstTokenTime = performance.now()
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          tokens++
        }
      }
    }

    if (buffer.startsWith('data: ') && buffer !== 'data: [DONE]') {
      tokens++
    }

    clearTimeout(timer)
    const endTime = performance.now()

    if (tokens === 0) {
      return {
        key,
        status: 'error',
        error: 'unknown',
        latency: endTime - startTime,
      }
    }

    return {
      key,
      status: 'success',
      latency: endTime - startTime,
      firstTokenLatency: firstTokenTime ? firstTokenTime - startTime : undefined,
      tokens,
      error: undefined,
    }
  } catch (err) {
    clearTimeout(timer)
    return {
      key,
      status: 'error',
      error: classifyError(undefined, err),
      latency: performance.now() - startTime,
    }
  }
}
