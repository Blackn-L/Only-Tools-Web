import type { ApiErrorCode } from '@/lib/openai'

export type ImageGenerationError = 'missing_field' | ApiErrorCode

export type ImageApiMode = 'images' | 'chat'

export type ImageGenerationSettings = {
  baseUrl: string
  key: string
  model: string
  size: string
  count: number
  apiMode: ImageApiMode
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
  apiMode: ImageApiMode
  signal: AbortSignal
}
