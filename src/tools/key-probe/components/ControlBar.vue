<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NCheckbox, NInputNumber, NText } from 'naive-ui'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()

function handleReset() {
  if (window.confirm(t('keyTester.clearConfirm'))) {
    store.reset()
  }
}
</script>

<template>
  <div class="control-bar">
    <div class="control-bar__actions">
      <n-button
        type="primary"
        :disabled="store.isRunning || store.keyList.length === 0"
        @click="store.testAll"
      >
        {{
          store.isRunning
            ? t('keyTester.actions.testing')
            : t('keyTester.actions.testAll', { count: store.keyList.length })
        }}
      </n-button>
      <n-button
        :disabled="store.isRunning || store.failedKeys.length === 0"
        @click="store.testFailed"
      >
        {{ t('keyTester.actions.retryFailed') }}
      </n-button>
      <n-button type="error" :disabled="store.isRunning" @click="handleReset">
        {{ t('keyTester.actions.clear') }}
      </n-button>
    </div>

    <div class="control-bar__settings">
      <n-checkbox v-model:checked="store.rememberKeys" :disabled="store.isRunning">
        {{ t('keyTester.actions.remember') }}
      </n-checkbox>
      <label class="concurrency">
        <n-text depth="3">{{ t('keyTester.stats.concurrency') }}</n-text>
        <n-input-number
          v-model:value="store.concurrency"
          :min="1"
          :max="50"
          :disabled="store.isRunning"
          :show-button="false"
          size="small"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.control-bar__actions,
.control-bar__settings {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.concurrency {
  display: flex;
  align-items: center;
  gap: 8px;
}

.concurrency :deep(.n-input-number) {
  width: 68px;
}

@media (max-width: 760px) {
  .control-bar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
