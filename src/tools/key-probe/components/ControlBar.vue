<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RotateCcw, Trash2, Wand2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()

const concurrencyModel = computed({
  get: () => store.concurrency,
  set: (value: string | number) => {
    const next = Number(value)
    if (Number.isFinite(next)) {
      store.concurrency = Math.min(50, Math.max(1, Math.trunc(next)))
    }
  },
})

function handleReset() {
  if (window.confirm(t('keyTester.clearConfirm'))) {
    store.reset()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex flex-wrap gap-2">
      <Button
        :disabled="store.isRunning || store.keyList.length === 0"
        @click="store.testAll"
      >
        <Wand2 data-icon="inline-start" />
        <span>
          {{
            store.isRunning
              ? t('keyTester.actions.testing')
              : t('keyTester.actions.testAll', { count: store.keyList.length })
          }}
        </span>
      </Button>
      <Button
        variant="outline"
        :disabled="store.isRunning || store.failedKeys.length === 0"
        @click="store.testFailed"
      >
        <RotateCcw data-icon="inline-start" />
        <span>{{ t('keyTester.actions.retryFailed') }}</span>
      </Button>
      <Button variant="destructive" :disabled="store.isRunning" @click="handleReset">
        <Trash2 data-icon="inline-start" />
        <span>{{ t('keyTester.actions.clear') }}</span>
      </Button>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <label class="flex items-center gap-2 text-sm">
        <Checkbox v-model="store.rememberKeys" :disabled="store.isRunning" />
        <span>{{ t('keyTester.actions.remember') }}</span>
      </label>
      <label class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{{ t('keyTester.stats.concurrency') }}</span>
        <Input
          v-model="concurrencyModel"
          class="h-8 w-20"
          type="number"
          min="1"
          max="50"
          :disabled="store.isRunning"
        />
      </label>
    </div>
  </div>
</template>
