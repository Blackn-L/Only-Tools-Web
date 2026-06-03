import type { ApiErrorCode } from '@/lib/openai'

export type KeyStatus = 'idle' | 'testing' | 'success' | 'error'

export type KeyError = ApiErrorCode

export type ApiProtocol = 'openai' | 'anthropic'

export type SortField = 'latency' | 'firstTokenLatency' | null
export type SortDir = 'asc' | 'desc'
export type FilterStatus = 'all' | 'success' | 'error' | 'testing' | 'idle'

export type KeyItem = {
  id: string
  key: string
  note: string
  baseUrl: string
  model: string
  protocol: ApiProtocol
  status: KeyStatus
  latency?: number
  firstTokenLatency?: number
  tokens?: number
  error?: KeyError
  message?: string
}

export type TestResult = {
  key: string
  status: KeyStatus
  latency?: number
  firstTokenLatency?: number
  tokens?: number
  error?: KeyError
  message?: string
}
