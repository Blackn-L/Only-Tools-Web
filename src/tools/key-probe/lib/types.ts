export type KeyStatus = 'idle' | 'testing' | 'success' | 'error'

export type KeyError =
  | 'invalid_key'
  | 'forbidden'
  | 'rate_limit'
  | 'timeout'
  | 'network'
  | 'unknown'

export type SortField = 'latency' | 'firstTokenLatency' | null
export type SortDir = 'asc' | 'desc'
export type FilterStatus = 'all' | 'success' | 'error' | 'testing' | 'idle'

export type KeyItem = {
  id: string
  key: string
  note: string
  baseUrl: string
  model: string
  status: KeyStatus
  latency?: number
  firstTokenLatency?: number
  tokens?: number
  error?: KeyError
}

export type TestResult = {
  key: string
  status: KeyStatus
  latency?: number
  firstTokenLatency?: number
  tokens?: number
  error?: KeyError
}
