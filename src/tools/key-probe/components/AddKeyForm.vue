<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ListPlus, Plus, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()

const key = ref('')
const note = ref('')
const baseUrl = ref('')
const model = ref('')
const feedback = ref('')
const batchMode = ref(false)
const batchText = ref('')

function setFeedback(message: string) {
  feedback.value = message
}

function clearFeedback() {
  feedback.value = ''
}

function handleAdd() {
  const trimmedKey = key.value.trim()
  const trimmedBaseUrl = baseUrl.value.trim()
  const trimmedModel = model.value.trim()

  if (!trimmedKey) {
    setFeedback(t('keyTester.warnings.key'))
    return
  }
  if (!trimmedBaseUrl) {
    setFeedback(t('keyTester.warnings.baseUrl'))
    return
  }
  if (!trimmedModel) {
    setFeedback(t('keyTester.warnings.model'))
    return
  }
  if (store.keyList.some((item) => item.key === trimmedKey && item.baseUrl === trimmedBaseUrl)) {
    setFeedback(t('keyTester.warnings.duplicate'))
    return
  }

  store.addKey(trimmedKey, note.value, trimmedBaseUrl, trimmedModel)
  key.value = ''
  note.value = ''
  clearFeedback()
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleAdd()
  }
}

type ParsedEntry = { key: string; baseUrl: string; model: string; note: string }

function parseBatchInput(text: string): ParsedEntry[] {
  const defaultBaseUrl = baseUrl.value.trim()
  const defaultModel = model.value.trim()
  const entries: ParsedEntry[] = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const parts = line.includes('\t') ? line.split('\t') : line.split(',')
    const cleaned = parts.map((p) => p.trim())

    const k = cleaned[0]
    if (!k) continue

    entries.push({
      key: k,
      baseUrl: cleaned[1] || defaultBaseUrl,
      model: cleaned[2] || defaultModel,
      note: cleaned[3] || '',
    })
  }

  return entries
}

const parsedEntries = computed(() => parseBatchInput(batchText.value))

function handleBatchAdd() {
  const entries = parsedEntries.value
  if (entries.length === 0) {
    setFeedback(t('keyTester.batch.empty'))
    return
  }

  if (!baseUrl.value.trim() || !model.value.trim()) {
    setFeedback(t('keyTester.batch.defaultsRequired'))
    return
  }

  let added = 0
  for (const entry of entries) {
    if (!entry.key || !entry.baseUrl || !entry.model) continue
    if (store.keyList.some((item) => item.key === entry.key && item.baseUrl === entry.baseUrl)) continue
    store.addKey(entry.key, entry.note, entry.baseUrl, entry.model)
    added++
  }

  if (added > 0) {
    batchText.value = ''
    clearFeedback()
  } else {
    setFeedback(t('keyTester.batch.allDuplicate'))
  }
}

function toggleMode() {
  batchMode.value = !batchMode.value
  clearFeedback()
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-end">
      <Button variant="ghost" size="sm" @click="toggleMode">
        <component :is="batchMode ? X : ListPlus" data-icon="inline-start" />
        <span>{{ batchMode ? t('keyTester.batch.single') : t('keyTester.batch.toggle') }}</span>
      </Button>
    </div>

    <form v-if="!batchMode" class="flex flex-col gap-3" @submit.prevent="handleAdd">
      <div class="grid gap-3 lg:grid-cols-[minmax(180px,1fr)_minmax(220px,1.2fr)_minmax(160px,0.8fr)_minmax(140px,0.8fr)_auto]">
        <Input
          v-model="key"
          :placeholder="t('keyTester.apiKey')"
          type="password"
          autocomplete="off"
          @input="clearFeedback"
          @keydown="handleKeyDown"
        />
        <Input
          v-model="baseUrl"
          :placeholder="t('keyTester.baseUrl')"
          type="url"
          @input="clearFeedback"
          @keydown="handleKeyDown"
        />
        <Input
          v-model="model"
          :placeholder="t('keyTester.model')"
          @input="clearFeedback"
          @keydown="handleKeyDown"
        />
        <Input
          v-model="note"
          :placeholder="t('keyTester.note')"
          @keydown="handleKeyDown"
        />
        <Button type="submit" :disabled="!key.trim()">
          <Plus data-icon="inline-start" />
          <span>{{ t('keyTester.add') }}</span>
        </Button>
      </div>
    </form>

    <div v-else class="flex flex-col gap-3">
      <div class="grid gap-3 lg:grid-cols-2">
        <Input
          v-model="baseUrl"
          :placeholder="t('keyTester.baseUrl')"
          type="url"
        />
        <Input
          v-model="model"
          :placeholder="t('keyTester.model')"
        />
      </div>
      <Textarea
        v-model="batchText"
        :placeholder="t('keyTester.batch.placeholder')"
        rows="6"
        class="font-mono text-sm"
        @input="clearFeedback"
      />
      <div class="flex items-center gap-3">
        <Button :disabled="parsedEntries.length === 0" @click="handleBatchAdd">
          <ListPlus data-icon="inline-start" />
          <span>{{ t('keyTester.batch.addAll') }}</span>
        </Button>
        <span v-if="batchText.trim()" class="text-sm text-muted-foreground">
          {{ t('keyTester.batch.parsed', { count: parsedEntries.length }) }}
        </span>
      </div>
    </div>

    <p v-if="feedback" class="text-sm text-destructive" role="alert">
      {{ feedback }}
    </p>
  </div>
</template>
