<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatMs } from '../lib/format'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()
</script>

<template>
  <div v-if="store.keyList.length > 0" class="flex flex-wrap gap-3 text-sm text-muted-foreground">
    <span>{{ t('keyTester.stats.total') }} <strong class="text-foreground">{{ store.stats.total }}</strong></span>
    <span>{{ t('keyTester.stats.available') }} <strong class="text-primary">{{ store.stats.success }}</strong></span>
    <span>{{ t('keyTester.stats.failed') }} <strong class="text-destructive">{{ store.stats.error }}</strong></span>
    <span v-if="store.stats.testing > 0">
      {{ t('keyTester.stats.testing') }} <strong class="text-foreground">{{ store.stats.testing }}</strong>
    </span>
    <template v-if="store.stats.success > 0">
      <span>
        {{ t('keyTester.stats.averageLatency') }}
        <strong class="font-mono text-foreground">{{ formatMs(store.stats.avgLatency) }}</strong>
      </span>
      <span>
        {{ t('keyTester.stats.firstToken') }}
        <strong class="font-mono text-foreground">{{ formatMs(store.stats.avgFirstToken) }}</strong>
      </span>
    </template>
  </div>
</template>
