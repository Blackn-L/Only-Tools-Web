export type ImageGenerationError =
  | 'missing_field'
  | 'invalid_key'
  | 'forbidden'
  | 'rate_limit'
  | 'timeout'
  | 'network'
  | 'unknown'

export type ImageGenerationSettings = {
  baseUrl: string
  key: string
  model: string
  size: string
  count: number
}

export type GeneratedImage = {
  id: string
  source: 'url' | 'base64'
  src: string
  createdAt: string
}

export type GenerateImageInput = {
  baseUrl: string
  key: string
  model: string
  prompt: string
  size: string
  count: number
  signal: AbortSignal
}
