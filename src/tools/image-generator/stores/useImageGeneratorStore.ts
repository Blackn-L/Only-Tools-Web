import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { generateImages, ImageGenerationRequestError } from '../lib/generateImage'
import type { GeneratedImage, ImageGenerationError, ImageGenerationSettings } from '../lib/types'

const STORAGE_KEY = 'only-tools-web:image-generator'
const TIMEOUT_MS = 120_000
const DEFAULT_SIZE = '1024x1024'
const DEFAULT_COUNT = 1

type StoredState = Partial<ImageGenerationSettings>

function loadFromStorage(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(settings: ImageGenerationSettings) {
  const hasLocalConfig =
    settings.baseUrl.trim() ||
    settings.key.trim() ||
    settings.model.trim() ||
    settings.size !== DEFAULT_SIZE ||
    settings.count !== DEFAULT_COUNT

  if (!hasLocalConfig) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      baseUrl: settings.baseUrl,
      key: settings.key,
      model: settings.model,
      size: settings.size,
      count: settings.count,
    }),
  )
}

function clampCount(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_COUNT
  return Math.min(4, Math.max(1, Math.trunc(value)))
}

export const useImageGeneratorStore = defineStore('image-generator', () => {
  const saved = loadFromStorage()
  const baseUrl = ref(saved.baseUrl ?? '')
  const key = ref(saved.key ?? '')
  const model = ref(saved.model ?? '')
  const size = ref(saved.size ?? DEFAULT_SIZE)
  const count = ref(clampCount(saved.count ?? DEFAULT_COUNT))
  const prompt = ref('')
  const images = ref<GeneratedImage[]>([])
  const error = ref<ImageGenerationError | null>(null)
  const errorMessage = ref<string | null>(null)
  const isGenerating = ref(false)
  const controller = ref<AbortController | null>(null)
  const cancelRequested = ref(false)

  const canGenerate = computed(
    () =>
      Boolean(baseUrl.value.trim()) &&
      Boolean(key.value.trim()) &&
      Boolean(model.value.trim()) &&
      Boolean(prompt.value.trim()) &&
      !isGenerating.value,
  )

  watch(
    [baseUrl, key, model, size, count],
    () => {
      saveToStorage({
        baseUrl: baseUrl.value,
        key: key.value,
        model: model.value,
        size: size.value,
        count: count.value,
      })
    },
    { deep: true, immediate: true },
  )

  function validate(): ImageGenerationError | null {
    return canGenerate.value ? null : 'missing_field'
  }
  function setCount(value: string | number) {
    count.value = clampCount(Number(value))
  }

  function clearResults() {
    images.value = []
    error.value = null
    errorMessage.value = null
  }

  function clearLocalData() {
    localStorage.removeItem(STORAGE_KEY)
    baseUrl.value = ''
    key.value = ''
    model.value = ''
    size.value = DEFAULT_SIZE
    count.value = DEFAULT_COUNT
    prompt.value = ''
    clearResults()
  }

  function cancelGeneration() {
    if (!controller.value) return
    cancelRequested.value = true
    controller.value.abort()
  }

  async function generate() {
    const validationError = validate()
    if (validationError) {
      error.value = validationError
      return
    }

    const activeController = new AbortController()
    const timer = window.setTimeout(() => activeController.abort(), TIMEOUT_MS)
    controller.value = activeController
    cancelRequested.value = false
    isGenerating.value = true
    error.value = null
    errorMessage.value = null

    try {
      images.value = await generateImages({
        baseUrl: baseUrl.value.trim(),
        key: key.value.trim(),
        model: model.value.trim(),
        prompt: prompt.value.trim(),
        size: size.value.trim(),
        count: count.value,
        signal: activeController.signal,
      })
    } catch (err) {
      if (!cancelRequested.value) {
        if (err instanceof ImageGenerationRequestError) {
          error.value = err.code
          errorMessage.value = err.detail ?? null
        } else {
          error.value = 'unknown'
          errorMessage.value = null
        }
      }
    } finally {
      window.clearTimeout(timer)
      if (controller.value === activeController) {
        controller.value = null
      }
      cancelRequested.value = false
      isGenerating.value = false
    }
  }

  return {
    baseUrl,
    key,
    model,
    size,
    count,
    prompt,
    images,
    error,
    errorMessage,
    isGenerating,
    canGenerate,
    setCount,
    clearResults,
    clearLocalData,
    cancelGeneration,
    generate,
  }
})
