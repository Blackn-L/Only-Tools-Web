<script setup lang="ts">
import { NSpace, NText } from 'naive-ui'
import { useKeyStore } from '@/stores/useKeyStore'
import { formatMs } from '@/lib/format'

const store = useKeyStore()
</script>

<template>
  <n-space v-if="store.keyList.length > 0" style="margin-bottom: 16px" :size="12">
    <n-text depth="3" style="font-size: 13px">
      共 <n-text strong>{{ store.stats.total }}</n-text>
    </n-text>
    <n-text depth="3" style="font-size: 13px">
      可用 <n-text strong type="success">{{ store.stats.success }}</n-text>
    </n-text>
    <n-text depth="3" style="font-size: 13px">
      失败 <n-text strong type="error">{{ store.stats.error }}</n-text>
    </n-text>
    <n-text v-if="store.stats.testing > 0" depth="3" style="font-size: 13px">
      测试中 <n-text strong type="warning">{{ store.stats.testing }}</n-text>
    </n-text>
    <template v-if="store.stats.success > 0">
      <n-text depth="3" style="font-size: 13px; margin-left: 8px">
        平均耗时 <n-text strong>{{ formatMs(store.stats.avgLatency) }}</n-text>
      </n-text>
      <n-text depth="3" style="font-size: 13px">
        平均首字 <n-text strong>{{ formatMs(store.stats.avgFirstToken) }}</n-text>
      </n-text>
    </template>
  </n-space>
</template>
