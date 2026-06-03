import { authHeaders } from '@/lib/openai'
import type { ApiProtocol } from './types'

const PROMPT = 'Reply with one word: hi'

type ProtocolSpec = {
  path: string
  headers: (key: string) => Record<string, string>
  body: (model: string) => string
  // Fallback check when a gateway ignores stream:true and returns one JSON blob.
  successPattern: RegExp
}

export const PROTOCOL_SPECS: Record<ApiProtocol, ProtocolSpec> = {
  openai: {
    path: '/v1/chat/completions',
    headers: (key) => authHeaders(key),
    body: (model) =>
      JSON.stringify({
        model,
        messages: [{ role: 'user', content: PROMPT }],
        stream: true,
        max_tokens: 20,
      }),
    successPattern: /"choices"\s*:/,
  },
  anthropic: {
    path: '/v1/messages',
    headers: (key) => ({
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    }),
    body: (model) =>
      JSON.stringify({
        model,
        max_tokens: 20,
        messages: [{ role: 'user', content: PROMPT }],
        stream: true,
      }),
    successPattern: /"(type|delta|content)"\s*:/,
  },
}

export const PROTOCOL_OPTIONS: ApiProtocol[] = ['openai', 'anthropic']

export const PROTOCOL_LABELS: Record<ApiProtocol, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
}

// Labels for the protocol picker — append the request path so it's clear the
// endpoint field only needs the base URL (the path is added automatically).
export const PROTOCOL_OPTION_LABELS: Record<ApiProtocol, string> = {
  openai: `${PROTOCOL_LABELS.openai} (${PROTOCOL_SPECS.openai.path})`,
  anthropic: `${PROTOCOL_LABELS.anthropic} (${PROTOCOL_SPECS.anthropic.path})`,
}
