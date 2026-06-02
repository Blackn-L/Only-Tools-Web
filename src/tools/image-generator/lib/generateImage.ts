import type { GeneratedImage, GenerateImageInput, ImageGenerationError } from './types'

type ImageApiItem = {
  url?: string
  b64_json?: string
}

type ImageApiResponse = {
  data?: ImageApiItem[]
}

export class ImageGenerationRequestError extends Error {
  code: ImageGenerationError

  constructor(code: ImageGenerationError) {
    super(code)
    this.name = 'ImageGenerationRequestError'
    this.code = code
  }
}

function buildImageUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/+$/, '')}/v1/images/generations`
}

function classifyError(status?: number, err?: unknown): ImageGenerationError {
  if (status === 401) return 'invalid_key'
  if (status === 403) return 'forbidden'
  if (status === 429) return 'rate_limit'
  if (err instanceof DOMException && err.name === 'AbortError') return 'timeout'
  if (err instanceof TypeError) return 'network'
  return 'unknown'
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
    const res = await fetch(buildImageUrl(input.baseUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${input.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: input.model,
        prompt: input.prompt,
        size: input.size,
        n: input.count,
      }),
      signal: input.signal,
    })

    if (!res.ok) {
      throw new ImageGenerationRequestError(classifyError(res.status))
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
    throw new ImageGenerationRequestError(classifyError(undefined, err))
  }
}
