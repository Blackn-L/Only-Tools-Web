<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Download,
  ExternalLink,
  ImageIcon,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from '@lucide/vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { GeneratedImage } from './lib/types'
import { useImageGeneratorStore } from './stores/useImageGeneratorStore'

const { t } = useI18n()
const store = useImageGeneratorStore()

const sizeOptions = ['1024x1024', '1024x1536', '1536x1024', '512x512']
const countModel = computed({
  get: () => store.count,
  set: (value: string | number) => store.setCount(value),
})
const isConfigIncomplete = computed(
  () => !store.baseUrl.trim() || !store.key.trim() || !store.model.trim(),
)

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

async function downloadImage(image: GeneratedImage) {
  const filename = `only-tools-image-${image.id}.png`

  if (image.source === 'base64') {
    triggerDownload(image.src, filename)
    return
  }

  try {
    const res = await fetch(image.src)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    triggerDownload(objectUrl, filename)
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(image.src, '_blank', 'noreferrer')
  }
}

function openImage(image: GeneratedImage) {
  window.open(image.src, '_blank', 'noreferrer')
}

function clearLocalData() {
  if (window.confirm(t('imageGenerator.clearLocalConfirm'))) {
    store.clearLocalData()
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex justify-end">
      <Dialog>
        <DialogTrigger as-child>
          <Button type="button" variant="outline" class="w-full sm:w-auto">
            <Settings2 data-icon="inline-start" />
            <span>{{ t('imageGenerator.actions.configure') }}</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{{ t('imageGenerator.settingsTitle') }}</DialogTitle>
            <DialogDescription>{{ t('imageGenerator.settingsDescription') }}</DialogDescription>
          </DialogHeader>

          <div class="flex flex-col gap-5">
            <Alert>
              <ShieldCheck />
              <AlertDescription>{{ t('imageGenerator.privacy') }}</AlertDescription>
            </Alert>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="flex flex-col gap-2 text-sm font-medium" for="image-base-url">
                <span>{{ t('imageGenerator.baseUrl') }}</span>
                <Input
                  id="image-base-url"
                  v-model="store.baseUrl"
                  type="url"
                  placeholder="https://api.example.com"
                  :aria-invalid="store.error === 'missing_field' && !store.baseUrl.trim()"
                />
              </label>

              <label class="flex flex-col gap-2 text-sm font-medium" for="image-api-key">
                <span>{{ t('imageGenerator.apiKey') }}</span>
                <Input
                  id="image-api-key"
                  v-model="store.key"
                  type="password"
                  autocomplete="off"
                  placeholder="API key"
                  :aria-invalid="store.error === 'missing_field' && !store.key.trim()"
                />
              </label>
            </div>

            <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px_120px]">
              <label class="flex flex-col gap-2 text-sm font-medium" for="image-model">
                <span>{{ t('imageGenerator.model') }}</span>
                <Input
                  id="image-model"
                  v-model="store.model"
                  placeholder="gpt-image-1"
                  :aria-invalid="store.error === 'missing_field' && !store.model.trim()"
                />
              </label>

              <label class="flex flex-col gap-2 text-sm font-medium" for="image-size">
                <span>{{ t('imageGenerator.size') }}</span>
                <Select v-model="store.size">
                  <SelectTrigger id="image-size" class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="option in sizeOptions" :key="option" :value="option">
                        {{ option }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>

              <label class="flex flex-col gap-2 text-sm font-medium" for="image-count">
                <span>{{ t('imageGenerator.count') }}</span>
                <Input
                  id="image-count"
                  v-model="countModel"
                  type="number"
                  min="1"
                  max="4"
                />
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="clearLocalData">
              <Trash2 data-icon="inline-start" />
              <span>{{ t('imageGenerator.actions.clearLocal') }}</span>
            </Button>
            <DialogClose as-child>
              <Button type="button">
                {{ t('imageGenerator.actions.done') }}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <section class="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form class="rounded-md border bg-card p-4 sm:p-5" @submit.prevent="store.generate">
        <div class="flex flex-col gap-4">
          <label class="flex flex-col gap-2 text-sm font-medium" for="image-prompt">
            <span>{{ t('imageGenerator.prompt') }}</span>
            <Textarea
              id="image-prompt"
              v-model="store.prompt"
              class="min-h-52 resize-y"
              :placeholder="t('imageGenerator.promptPlaceholder')"
              :aria-invalid="store.error === 'missing_field' && !store.prompt.trim()"
            />
          </label>

          <p v-if="isConfigIncomplete" class="text-sm text-muted-foreground">
            {{ t('imageGenerator.configRequired') }}
          </p>

          <div class="flex flex-wrap gap-2">
            <Button
              type="submit"
              :disabled="store.isGenerating || !store.prompt.trim()"
            >
              <Sparkles data-icon="inline-start" />
              <span>
                {{
                  store.isGenerating
                    ? t('imageGenerator.actions.generating')
                    : t('imageGenerator.actions.generate')
                }}
              </span>
            </Button>
            <Button
              v-if="store.isGenerating"
              type="button"
              variant="outline"
              @click="store.cancelGeneration"
            >
              <X data-icon="inline-start" />
              <span>{{ t('imageGenerator.actions.cancel') }}</span>
            </Button>
          </div>

          <Alert v-if="store.error" variant="destructive">
            <AlertDescription>{{ t(`imageGenerator.errors.${store.error}`) }}</AlertDescription>
          </Alert>
        </div>
      </form>

      <section class="rounded-md border bg-card p-4 sm:p-5" aria-live="polite">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-xl font-semibold">{{ t('imageGenerator.results.title') }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ t('imageGenerator.results.count', { count: store.images.length }) }}
              </p>
            </div>
            <Button
              v-if="store.images.length > 0"
              type="button"
              variant="outline"
              size="sm"
              @click="store.clearResults"
            >
              <Trash2 data-icon="inline-start" />
              <span>{{ t('imageGenerator.actions.clearResults') }}</span>
            </Button>
          </div>

          <div v-if="store.images.length > 0" class="grid gap-4 sm:grid-cols-2">
            <article
              v-for="image in store.images"
              :key="image.id"
              class="overflow-hidden rounded-md border bg-background"
            >
              <img
                class="aspect-square w-full object-cover"
                :src="image.src"
                :alt="t('imageGenerator.results.imageAlt')"
              />
              <div class="flex flex-col gap-3 p-3">
                <div class="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{{ image.source }}</Badge>
                  <span class="text-xs text-muted-foreground">{{ image.createdAt.slice(0, 10) }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" @click="downloadImage(image)">
                    <Download data-icon="inline-start" />
                    <span>{{ t('imageGenerator.actions.download') }}</span>
                  </Button>
                  <Button type="button" variant="outline" size="sm" @click="openImage(image)">
                    <ExternalLink data-icon="inline-start" />
                    <span>{{ t('imageGenerator.actions.openOriginal') }}</span>
                  </Button>
                </div>
              </div>
            </article>
          </div>

          <div
            v-else
            class="flex min-h-72 flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center"
          >
            <ImageIcon class="text-muted-foreground" />
            <p class="text-sm text-muted-foreground">
              {{
                store.isGenerating
                  ? t('imageGenerator.results.generating')
                  : t('imageGenerator.results.empty')
              }}
            </p>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
