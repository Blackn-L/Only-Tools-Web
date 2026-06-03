// In dev, fall back to the built-in Vite proxy (see vite.config.ts) so requests
// to CORS-less endpoints work with zero configuration. In production set
// VITE_API_PROXY_URL to a CORS proxy (e.g. a Cloudflare Worker).
const PROXY_URL =
  import.meta.env.VITE_API_PROXY_URL || (import.meta.env.DEV ? '/__api_proxy?target=' : '')

export type ApiErrorCode =
  | 'invalid_key'
  | 'forbidden'
  | 'rate_limit'
  | 'bad_request'
  | 'not_found'
  | 'server_error'
  | 'timeout'
  | 'network'
  | 'unknown'

export function buildEndpointUrl(baseUrl: string, path: string): string {
  const target = `${baseUrl.replace(/\/+$/, '')}${path}`
  return PROXY_URL ? `${PROXY_URL}${encodeURIComponent(target)}` : target
}

export function authHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

export function classifyHttpError(status?: number, err?: unknown): ApiErrorCode {
  if (status !== undefined) {
    if (status === 400) return 'bad_request'
    if (status === 401) return 'invalid_key'
    if (status === 403) return 'forbidden'
    if (status === 404) return 'not_found'
    if (status === 429) return 'rate_limit'
    if (status >= 500) return 'server_error'
    return 'unknown'
  }
  if (err instanceof DOMException && err.name === 'AbortError') return 'timeout'
  if (err instanceof TypeError) return 'network'
  return 'unknown'
}

// Reads the response body of a failed request and pulls out the most
// human-readable message — OpenAI-compatible errors put it at error.message.
export async function extractApiErrorMessage(res: Response): Promise<string | undefined> {
  let text: string
  try {
    text = await res.text()
  } catch {
    return undefined
  }
  if (!text) return undefined

  try {
    const json = JSON.parse(text) as {
      error?: { message?: string } | string
      message?: string
    }
    const candidate =
      (typeof json.error === 'object' ? json.error?.message : json.error) ?? json.message
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim().slice(0, 300)
    }
  } catch {
    // Body is not JSON — fall back to the raw text below.
  }

  return text.slice(0, 300).trim() || undefined
}
