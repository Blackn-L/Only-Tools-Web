import type { ApiProtocol, TestResult } from './types'
import {
  buildEndpointUrl,
  classifyHttpError,
  extractApiErrorMessage,
} from '@/lib/openai'
import { PROTOCOL_SPECS } from './protocols'

const TIMEOUT_MS = 10_000

function isDataLine(line: string) {
  const trimmed = line.trim()
  return (
    trimmed.startsWith('data:') &&
    trimmed !== 'data: [DONE]' &&
    trimmed !== 'data:[DONE]'
  )
}

export async function testKey(
  key: string,
  baseUrl: string,
  model: string,
  protocol: ApiProtocol,
): Promise<TestResult> {
  const spec = PROTOCOL_SPECS[protocol]
  const controller = new AbortController()
  let timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const resetTimer = () => {
    clearTimeout(timer)
    timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  }
  const startTime = performance.now()

  try {
    const res = await fetch(buildEndpointUrl(baseUrl, spec.path), {
      method: 'POST',
      headers: spec.headers(key),
      body: spec.body(model),
      signal: controller.signal,
    })

    if (!res.ok) {
      const message = await extractApiErrorMessage(res)
      clearTimeout(timer)
      return {
        key,
        status: 'error',
        error: classifyHttpError(res.status),
        message,
        latency: performance.now() - startTime,
      }
    }

    if (!res.body) {
      clearTimeout(timer)
      return { key, status: 'error', error: 'unknown', latency: performance.now() - startTime }
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let firstTokenTime: number | undefined
    let chunks = 0
    let buffer = ''
    let rawSample = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      resetTimer()

      if (!firstTokenTime) firstTokenTime = performance.now()

      const text = decoder.decode(value, { stream: true })
      if (rawSample.length < 4096) rawSample += text
      buffer += text
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (isDataLine(line)) chunks++
      }
    }

    if (isDataLine(buffer)) chunks++

    clearTimeout(timer)
    const endTime = performance.now()

    // Some gateways ignore stream:true and return a single JSON body instead of
    // SSE. Treat a valid chat/messages JSON as success rather than "unknown".
    if (chunks === 0) {
      if (!spec.successPattern.test(rawSample)) {
        return { key, status: 'error', error: 'unknown', latency: endTime - startTime }
      }
      return {
        key,
        status: 'success',
        latency: endTime - startTime,
        firstTokenLatency: firstTokenTime ? firstTokenTime - startTime : undefined,
        tokens: 1,
        message: undefined,
        error: undefined,
      }
    }

    return {
      key,
      status: 'success',
      latency: endTime - startTime,
      firstTokenLatency: firstTokenTime ? firstTokenTime - startTime : undefined,
      tokens: chunks,
      message: undefined,
      error: undefined,
    }
  } catch (err) {
    clearTimeout(timer)
    return {
      key,
      status: 'error',
      error: classifyHttpError(undefined, err),
      latency: performance.now() - startTime,
    }
  }
}
