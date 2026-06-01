<script setup lang="ts">
import { NSpace, NButton, NInputNumber } from 'naive-ui'
import { useKeyStore } from '@/stores/useKeyStore'

const store = useKeyStore()

function handleReset() {
  if (window.confirm('确认清空所有 Key？')) {
    store.reset()
  }
}
</script>

<template>
  <n-space style="margin-bottom: 16px" :size="8" align="center">
    <n-button
      type="primary"
      :disabled="store.isRunning || store.keyList.length === 0"
      @click="store.testAll"
    >
      {{ store.isRunning ? '测试中...' : `测试全部（${store.keyList.length}）` }}
    </n-button>
    <n-button
      :disabled="store.isRunning || store.failedKeys.length === 0"
      @click="store.testFailed"
    >
      重测失败
    </n-button>
    <n-button
      type="error"
      :disabled="store.isRunning"
      @click="handleReset"
    >
      清空
    </n-button>
    <n-space style="margin-left: auto" :size="4" align="center">
      <n-text depth="3" style="font-size: 12px">并发</n-text>
      <n-input-number
        v-model:value="store.concurrency"
        :min="1"
        :max="50"
        :disabled="store.isRunning"
        :show-button="false"
        style="width: 60px"
        size="small"
      />
    </n-space>
  </n-space>
</template>
