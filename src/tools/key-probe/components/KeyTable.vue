<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NDataTable, NTag, NText, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { formatMs, truncateKey } from '../lib/format'
import type { KeyError, KeyItem, KeyStatus } from '../lib/types'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const message = useMessage()
const { t } = useI18n()

const statusType: Record<KeyStatus, 'success' | 'error' | 'warning' | 'default'> = {
  idle: 'default',
  testing: 'warning',
  success: 'success',
  error: 'error',
}

function statusLabel(status: KeyStatus) {
  return t(`keyTester.status.${status}`)
}

function errorText(error: KeyError) {
  return t(`keyTester.errors.${error}`)
}

function handleCopyKey(key: string) {
  navigator.clipboard.writeText(key)
  message.success(t('keyTester.copied'))
}

function handleRemove(item: KeyItem) {
  if (window.confirm(`${t('keyTester.removeConfirm')}\n${truncateKey(item.key)}`)) {
    store.removeKey(item.id)
  }
}

const columns = computed<DataTableColumns<KeyItem>>(() => [
  {
    title: '#',
    key: 'index',
    width: 50,
    render: (_, i) => h('span', { style: 'color: var(--n-text-color-3)' }, String(i + 1)),
  },
  {
    title: t('keyTester.table.key'),
    key: 'key',
    ellipsis: { tooltip: true },
    render: (row) =>
      h(
        'button',
        {
          class: 'copy-key-button',
          title: t('keyTester.table.copyKey'),
          onClick: () => handleCopyKey(row.key),
        },
        truncateKey(row.key),
      ),
  },
  {
    title: t('keyTester.table.endpoint'),
    key: 'baseUrl',
    ellipsis: { tooltip: true },
    render: (row) => h('span', { style: 'font-family: monospace' }, row.baseUrl),
  },
  {
    title: t('keyTester.table.model'),
    key: 'model',
    ellipsis: { tooltip: true },
    render: (row) => h('span', { style: 'font-family: monospace' }, row.model),
  },
  {
    title: t('keyTester.table.note'),
    key: 'note',
    ellipsis: { tooltip: true },
    render: (row) => h('span', { style: 'color: var(--n-text-color-3)' }, row.note || '-'),
  },
  {
    title: t('keyTester.table.status'),
    key: 'status',
    width: 110,
    render: (row) =>
      h(
        NTag,
        { type: statusType[row.status], size: 'small', bordered: false },
        { default: () => statusLabel(row.status) },
      ),
  },
  {
    title: t('keyTester.table.latency'),
    key: 'latency',
    width: 110,
    align: 'right',
    render: (row) => h('span', { style: 'font-family: monospace' }, formatMs(row.latency)),
  },
  {
    title: t('keyTester.table.firstToken'),
    key: 'firstTokenLatency',
    width: 120,
    align: 'right',
    render: (row) => h('span', { style: 'font-family: monospace' }, formatMs(row.firstTokenLatency)),
  },
  {
    title: t('keyTester.table.chunks'),
    key: 'tokens',
    width: 80,
    align: 'right',
    render: (row) => h('span', { style: 'font-family: monospace' }, row.tokens ?? '-'),
  },
  {
    title: t('keyTester.table.error'),
    key: 'error',
    width: 130,
    render: (row) =>
      h('span', { style: 'color: var(--n-error-color)' }, row.error ? errorText(row.error) : ''),
  },
  {
    title: t('keyTester.table.actions'),
    key: 'actions',
    width: 150,
    align: 'right',
    render: (row) =>
      h('div', { class: 'table-actions' }, [
        h(
          NButton,
          {
            size: 'tiny',
            secondary: true,
            disabled: row.status === 'testing',
            onClick: () => store.testOne(row),
          },
          { default: () => (row.status === 'testing' ? '...' : t('keyTester.actions.test')) },
        ),
        h(
          NButton,
          {
            size: 'tiny',
            secondary: true,
            type: 'error',
            disabled: row.status === 'testing',
            onClick: () => handleRemove(row),
          },
          { default: () => t('keyTester.actions.delete') },
        ),
      ]),
  },
])
</script>

<template>
  <n-data-table
    v-if="store.keyList.length > 0"
    :columns="columns"
    :data="store.displayList"
    :bordered="false"
    :single-line="false"
    size="small"
    :row-key="(row: KeyItem) => row.id"
  />
  <n-text v-else depth="3" class="empty-state">
    {{ t('keyTester.table.empty') }}
  </n-text>
</template>

<style scoped>
:deep(.copy-key-button) {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: monospace;
  padding: 0;
}

:deep(.table-actions) {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.empty-state {
  display: block;
  padding: 72px 0;
  text-align: center;
}
</style>
