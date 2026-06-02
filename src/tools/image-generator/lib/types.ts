import type { ApiErrorCode } from '@/lib/openai'

export type ImageGenerationError = 'missing_field' | ApiErrorCode

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
