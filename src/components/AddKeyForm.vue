<script setup lang="ts">
import { ref } from 'vue'
import { NSpace, NInput, NButton, useMessage } from 'naive-ui'
import { useKeyStore } from '@/stores/useKeyStore'

const DEFAULT_BASE_URL = 'https://token-plan-cn.xiaomimimo.com'

const store = useKeyStore()
const message = useMessage()
const key = ref('')
const note = ref('')
const baseUrl = ref(DEFAULT_BASE_URL)

function handleAdd() {
  const trimmed = key.value.trim()
  if (!trimmed) {
    message.warning('请输入 Key')
    return
  }
  if (store.keyList.some((k) => k.key === trimmed)) {
    message.error('Key 已存在')
    return
  }
  store.addKey(trimmed, note.value, baseUrl.value)
  key.value = ''
  note.value = ''
  baseUrl.value = DEFAULT_BASE_URL
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleAdd()
  }
}
</script>

<template>
  <n-space style="margin-bottom: 20px" :size="8">
    <n-input
      v-model:value="key"
      placeholder="输入 Key（tp-xxxx）"
      style="flex: 1; font-family: monospace"
      @keydown="handleKeyDown"
    />
    <n-input
      v-model:value="note"
      placeholder="备注（可选）"
      style="width: 150px"
      @keydown="handleKeyDown"
    />
    <n-input
      v-model:value="baseUrl"
      placeholder="Base URL"
      style="width: 280px; font-family: monospace"
      @keydown="handleKeyDown"
    />
    <n-button type="primary" :disabled="!key.trim()" @click="handleAdd">
      添加
    </n-button>
  </n-space>
</template>
