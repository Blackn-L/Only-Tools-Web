import type { GeneratedImage, GenerateImageInput, ImageGenerationError } from './types'
import {
  authHeaders,
  buildEndpointUrl,
  classifyHttpError,
  extractApiErrorMessage,
} from '@/lib/openai'

type ImageApiItem = {
  url?: string
  b64_json?: string
}

type ImageApiResponse = {
  data?: ImageApiItem[]
}

export class ImageGenerationRequestError extends Error {
  code: ImageGenerationError
  detail?: string

  constructor(code: ImageGenerationError, detail?: string) {
    super(detail || code)
    this.name = 'ImageGenerationRequestError'
    this.code = code
    this.detail = detail
  }
}

function toDataUrl(value: string) {
  return value.startsWith('data:') ? value : `data:image/png;base64,${value}`
}

function toGeneratedImages(payload: ImageApiResponse): GeneratedImage[] {
  const now = new Date().toISOString()
  return (payload.data ?? [])
    .map((item, index): GeneratedImage | null => {
      if (item.url) {
        return {
          id: `${Date.now()}-${index}`,
          source: 'url',
          src: item.url,
          createdAt: now,
        }
      }
      if (item.b64_json) {
        return {
          id: `${Date.now()}-${index}`,
          source: 'base64',
          src: toDataUrl(item.b64_json),
          createdAt: now,
        }
      }
      return null
    })
    .filter((item): item is GeneratedImage => item !== null)
}

export async function generateImages(input: GenerateImageInput): Promise<GeneratedImage[]> {
  try {
    const res = await fetch(buildEndpointUrl(input.baseUrl, '/v1/images/generations'), {
      method: 'POST',
      headers: authHeaders(input.key),
      body: JSON.stringify({
        model: input.model,
        prompt: input.prompt,
        size: input.size,
        n: input.count,
      }),
      signal: input.signal,
    })

    if (!res.ok) {
      const detail = await extractApiErrorMessage(res)
      throw new ImageGenerationRequestError(classifyHttpError(res.status), detail)
    }

    const payload = (await res.json()) as ImageApiResponse
    const images = toGeneratedImages(payload)

    if (images.length === 0) {
      throw new ImageGenerationRequestError('unknown')
    }

    return images
  } catch (err) {
    if (err instanceof ImageGenerationRequestError) {
      throw err
    }
    throw new ImageGenerationRequestError(classifyHttpError(undefined, err))
  }
}
