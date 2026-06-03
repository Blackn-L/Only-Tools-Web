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

// Chat-completions responses vary by gateway; an image can arrive as a dedicated
// images array, a multimodal content array, or inline in the text reply.
type ChatImagePart = { image_url?: { url?: string } }
type ChatMessage = {
  content?: string | ChatImagePart[]
  images?: Array<string | { url?: string; image_url?: { url?: string } }>
}
type ChatResponse = {
  choices?: Array<{ message?: ChatMessage }>
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

function toGeneratedImage(src: string, index: number): GeneratedImage {
  return {
    id: `${Date.now()}-${index}`,
    source: src.startsWith('data:') ? 'base64' : 'url',
    src,
    createdAt: new Date().toISOString(),
  }
}

function toGeneratedImages(payload: ImageApiResponse): GeneratedImage[] {
  return (payload.data ?? [])
    .map((item) => (item.url ? item.url : item.b64_json ? toDataUrl(item.b64_json) : null))
    .filter((src): src is string => src !== null)
    .map(toGeneratedImage)
}

// Pull image links out of a chat text reply: markdown images, data URLs, and
// bare http(s) links (some gateways return the URL as plain text).
function extractUrlsFromText(text: string): string[] {
  const urls: string[] = []
  const markdown = /!\[[^\]]*\]\((\S+?)\)/g
  const dataUrl = /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g
  const bareUrl = /https?:\/\/[^\s)"']+/g

  let match: RegExpExecArray | null
  while ((match = markdown.exec(text)) !== null) urls.push(match[1])
  for (const m of text.match(dataUrl) ?? []) urls.push(m)
  for (const m of text.match(bareUrl) ?? []) {
    if (!urls.includes(m)) urls.push(m)
  }
  return urls
}

function extractChatImages(payload: ChatResponse): string[] {
  const message = payload?.choices?.[0]?.message
  if (!message) return []
  const urls: string[] = []

  if (Array.isArray(message.images)) {
    for (const item of message.images) {
      const url = typeof item === 'string' ? item : (item?.image_url?.url ?? item?.url)
      if (url) urls.push(url)
    }
  }

  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      const url = part?.image_url?.url
      if (url) urls.push(url)
    }
  } else if (typeof message.content === 'string') {
    urls.push(...extractUrlsFromText(message.content))
  }

  return urls
}

function chatReplyText(payload: ChatResponse): string | undefined {
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content === 'string') return content.slice(0, 300).trim() || undefined
  return undefined
}

async function generateViaImagesApi(input: GenerateImageInput): Promise<GeneratedImage[]> {
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
}

async function generateViaChatApi(input: GenerateImageInput): Promise<GeneratedImage[]> {
  const res = await fetch(buildEndpointUrl(input.baseUrl, '/v1/chat/completions'), {
    method: 'POST',
    headers: authHeaders(input.key),
    body: JSON.stringify({
      model: input.model,
      messages: [{ role: 'user', content: input.prompt }],
      stream: false,
    }),
    signal: input.signal,
  })

  if (!res.ok) {
    const detail = await extractApiErrorMessage(res)
    throw new ImageGenerationRequestError(classifyHttpError(res.status), detail)
  }

  const payload = (await res.json()) as ChatResponse
  const images = extractChatImages(payload).map(toGeneratedImage)
  if (images.length === 0) {
    // No image found — surface the text reply so the user can see what the
    // gateway actually returned (e.g. "this model does not support images").
    throw new ImageGenerationRequestError('unknown', chatReplyText(payload))
  }
  return images
}

export async function generateImages(input: GenerateImageInput): Promise<GeneratedImage[]> {
  try {
    return input.apiMode === 'chat'
      ? await generateViaChatApi(input)
      : await generateViaImagesApi(input)
  } catch (err) {
    if (err instanceof ImageGenerationRequestError) {
      throw err
    }
    throw new ImageGenerationRequestError(classifyHttpError(undefined, err))
  }
}
