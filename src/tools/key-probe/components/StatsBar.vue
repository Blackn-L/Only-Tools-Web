<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { formatMs } from '../lib/format'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()
</script>

<template>
  <div v-if="store.keyList.length > 0" class="stats-bar">
    <n-text depth="3">{{ t('keyTester.stats.total') }} <strong>{{ store.stats.total }}</strong></n-text>
    <n-text depth="3">{{ t('keyTester.stats.available') }} <strong class="success">{{ store.stats.success }}</strong></n-text>
    <n-text depth="3">{{ t('keyTester.stats.failed') }} <strong class="error">{{ store.stats.error }}</strong></n-text>
    <n-text v-if="store.stats.testing > 0" depth="3">
      {{ t('keyTester.stats.testing') }} <strong>{{ store.stats.testing }}</strong>
    </n-text>
    <template v-if="store.stats.success > 0">
      <n-text depth="3">{{ t('keyTester.stats.averageLatency') }} <strong>{{ formatMs(store.stats.avgLatency) }}</strong></n-text>
      <n-text depth="3">{{ t('keyTester.stats.firstToken') }} <strong>{{ formatMs(store.stats.avgFirstToken) }}</strong></n-text>
    </template>
  </div>
</template>

<style scoped>
.stats-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
  font-size: 13px;
}

.success {
  color: #1f7a5a;
}

.error {
  color: #c2410c;
}
</style>
