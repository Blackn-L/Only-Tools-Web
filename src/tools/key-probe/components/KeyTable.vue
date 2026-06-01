<script setup lang="ts">
import { h } from 'vue'
import { NButton, NDataTable, NTag, NText, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { formatMs, truncateKey } from '../lib/format'
import type { KeyError, KeyItem, KeyStatus } from '../lib/types'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const message = useMessage()

const statusMap: Record<KeyStatus, { label: string; type: 'success' | 'error' | 'warning' | 'default' }> = {
  idle: { label: 'Idle', type: 'default' },
  testing: { label: 'Testing', type: 'warning' },
  success: { label: 'Available', type: 'success' },
  error: { label: 'Failed', type: 'error' },
}

const errorLabel: Record<KeyError, string> = {
  invalid_key: 'Invalid key',
  forbidden: 'Forbidden',
  rate_limit: 'Rate limited',
  timeout: 'Timeout',
  network: 'Network error',
  unknown: 'Unknown error',
}

function handleCopyKey(key: string) {
  navigator.clipboard.writeText(key)
  message.success('Key copied to clipboard.')
}

function handleRemove(item: KeyItem) {
  if (window.confirm(`Remove this key?\n${truncateKey(item.key)}`)) {
    store.removeKey(item.id)
  }
}

const columns: DataTableColumns<KeyItem> = [
  {
    title: '#',
    key: 'index',
    width: 50,
    render: (_, i) => h('span', { style: 'color: var(--n-text-color-3)' }, String(i + 1)),
  },
  {
    title: 'Key',
    key: 'key',
    ellipsis: { tooltip: true },
    render: (row) =>
      h(
        'button',
        {
          class: 'copy-key-button',
          title: 'Copy key',
          onClick: () => handleCopyKey(row.key),
        },
        truncateKey(row.key),
      ),
  },
  {
    title: 'Endpoint',
    key: 'baseUrl',
    ellipsis: { tooltip: true },
    render: (row) => h('span', { style: 'font-family: monospace' }, row.baseUrl),
  },
  {
    title: 'Model',
    key: 'model',
    ellipsis: { tooltip: true },
    render: (row) => h('span', { style: 'font-family: monospace' }, row.model),
  },
  {
    title: 'Note',
    key: 'note',
    ellipsis: { tooltip: true },
    render: (row) => h('span', { style: 'color: var(--n-text-color-3)' }, row.note || '-'),
  },
  {
    title: 'Status',
    key: 'status',
    width: 110,
    render: (row) => {
      const { label, type } = statusMap[row.status]
      return h(NTag, { type, size: 'small', bordered: false }, { default: () => label })
    },
  },
  {
    title: 'Latency',
    key: 'latency',
    width: 110,
    align: 'right',
    render: (row) => h('span', { style: 'font-family: monospace' }, formatMs(row.latency)),
  },
  {
    title: 'First token',
    key: 'firstTokenLatency',
    width: 120,
    align: 'right',
    render: (row) => h('span', { style: 'font-family: monospace' }, formatMs(row.firstTokenLatency)),
  },
  {
    title: 'Chunks',
    key: 'tokens',
    width: 80,
    align: 'right',
    render: (row) => h('span', { style: 'font-family: monospace' }, row.tokens ?? '-'),
  },
  {
    title: 'Error',
    key: 'error',
    width: 130,
    render: (row) =>
      h('span', { style: 'color: var(--n-error-color)' }, row.error ? errorLabel[row.error] : ''),
  },
  {
    title: 'Actions',
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
          { default: () => (row.status === 'testing' ? '...' : 'Test') },
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
          { default: () => 'Delete' },
        ),
      ]),
  },
]
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
    Add a key, endpoint, and model to start testing.
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
