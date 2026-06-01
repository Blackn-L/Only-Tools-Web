<script setup lang="ts">
import { NDataTable, NButton, NTag, NSpace, NText, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { useKeyStore } from '@/stores/useKeyStore'
import { formatMs, truncateKey } from '@/lib/format'
import type { KeyItem, KeyStatus, KeyError } from '@/lib/types'

const store = useKeyStore()
const message = useMessage()

const STATUS_MAP: Record<KeyStatus, { label: string; type: 'success' | 'error' | 'warning' | 'default' }> = {
  idle: { label: '待测', type: 'default' },
  testing: { label: '测试中', type: 'warning' },
  success: { label: '可用', type: 'success' },
  error: { label: '失败', type: 'error' },
}

const ERROR_LABEL: Record<KeyError, string> = {
  invalid_key: '无效 Key',
  forbidden: '禁止访问',
  rate_limit: '频率限制',
  timeout: '超时',
  network: '网络错误',
  unknown: '未知错误',
}

function handleCopyKey(key: string) {
  navigator.clipboard.writeText(key)
  message.success('已复制 Key')
}

function handleCopyCCSwitch(row: KeyItem) {
  store.copyCCSwitchConfig(row.key, row.baseUrl)
  message.success('已复制 cc-switch 配置')
}

const columns: DataTableColumns<KeyItem> = [
  { title: '#', key: 'index', width: 50, render: (_, i) => h('span', { style: 'color: var(--n-text-color-3)' }, String(i + 1)) },
  { title: 'Key', key: 'key', ellipsis: { tooltip: true }, render: (row) => h('span', { style: 'font-family: monospace; cursor: pointer', title: '点击复制', onClick: () => handleCopyKey(row.key) }, truncateKey(row.key)) },
  { title: '备注', key: 'note', ellipsis: { tooltip: true }, render: (row) => h('span', { style: 'color: var(--n-text-color-3)' }, row.note || '—') },
  {
    title: '状态', key: 'status', width: 80,
    render: (row) => {
      const { label, type } = STATUS_MAP[row.status]
      return h(NTag, { type, size: 'small', bordered: false }, { default: () => label })
    },
  },
  { title: '总耗时', key: 'latency', width: 100, align: 'right', render: (row) => h('span', { style: 'font-family: monospace; font-variant-numeric: tabular-nums' }, formatMs(row.latency)) },
  { title: '首字时间', key: 'firstTokenLatency', width: 100, align: 'right', render: (row) => h('span', { style: 'font-family: monospace; font-variant-numeric: tabular-nums' }, formatMs(row.firstTokenLatency)) },
  { title: 'Chunks', key: 'tokens', width: 70, align: 'right', render: (row) => h('span', { style: 'font-family: monospace; font-variant-numeric: tabular-nums' }, row.tokens ?? '—') },
  { title: '错误', key: 'error', width: 100, render: (row) => h('span', { style: 'color: var(--n-error-color)' }, row.error ? ERROR_LABEL[row.error] : '') },
  {
    title: '操作', key: 'actions', width: 180, align: 'right',
    render: (row) =>
      h(NSpace, { size: 4, justify: 'end' }, {
        default: () => [
          h(NButton, { size: 'tiny', quaternary: true, disabled: row.status === 'testing', onClick: () => store.testOne(row) }, { default: () => row.status === 'testing' ? '...' : '测试' }),
          h(NButton, { size: 'tiny', quaternary: true, onClick: () => handleCopyCCSwitch(row) }, { default: () => 'cc-switch' }),
          h(NButton, { size: 'tiny', quaternary: true, type: 'error', disabled: row.status === 'testing', onClick: () => handleRemove(row) }, { default: () => '删除' }),
        ],
      }),
  },
]

function handleRemove(item: KeyItem) {
  if (window.confirm(`确认删除 Key？\n${item.key}`)) {
    store.removeKey(item.id)
  }
}
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
  <n-text v-else depth="3" style="display: block; text-align: center; padding: 80px 0; font-size: 13px">
    添加 Key 开始测试
  </n-text>
</template>
