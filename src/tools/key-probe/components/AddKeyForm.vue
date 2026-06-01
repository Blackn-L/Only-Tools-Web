<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const message = useMessage()

const key = ref('')
const note = ref('')
const baseUrl = ref('')
const model = ref('')

function handleAdd() {
  const trimmedKey = key.value.trim()
  const trimmedBaseUrl = baseUrl.value.trim()
  const trimmedModel = model.value.trim()

  if (!trimmedKey) {
    message.warning('Please enter an API key.')
    return
  }
  if (!trimmedBaseUrl) {
    message.warning('Please enter a Base URL.')
    return
  }
  if (!trimmedModel) {
    message.warning('Please enter a model name.')
    return
  }
  if (store.keyList.some((item) => item.key === trimmedKey && item.baseUrl === trimmedBaseUrl)) {
    message.error('This key and endpoint already exist.')
    return
  }

  store.addKey(trimmedKey, note.value, trimmedBaseUrl, trimmedModel)
  key.value = ''
  note.value = ''
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleAdd()
  }
}
</script>

<template>
  <form class="add-key-form" @submit.prevent="handleAdd">
    <n-input
      v-model:value="key"
      placeholder="API key"
      type="password"
      show-password-on="click"
      @keydown="handleKeyDown"
    />
    <n-input
      v-model:value="baseUrl"
      placeholder="Base URL, for example https://api.example.com"
      @keydown="handleKeyDown"
    />
    <n-input
      v-model:value="model"
      placeholder="Model name"
      @keydown="handleKeyDown"
    />
    <n-input
      v-model:value="note"
      placeholder="Note"
      @keydown="handleKeyDown"
    />
    <n-button attr-type="submit" type="primary" :disabled="!key.trim()">
      Add
    </n-button>
  </form>
</template>

<style scoped>
.add-key-form {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(220px, 1.2fr) minmax(160px, 0.8fr) minmax(140px, 0.8fr) auto;
  gap: 10px;
  margin-bottom: 18px;
}

@media (max-width: 980px) {
  .add-key-form {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .add-key-form {
    grid-template-columns: 1fr;
  }
}
</style>
