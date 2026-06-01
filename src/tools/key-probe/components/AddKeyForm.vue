<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()

const key = ref('')
const note = ref('')
const baseUrl = ref('')
const model = ref('')
const feedback = ref('')

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
</script>

<template>
  <form class="flex flex-col gap-3" @submit.prevent="handleAdd">
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
    <p v-if="feedback" class="text-sm text-destructive" role="alert">
      {{ feedback }}
    </p>
  </form>
</template>
