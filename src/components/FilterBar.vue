<script setup lang="ts">
import { NSpace, NButton, NText } from 'naive-ui'
import { useKeyStore } from '@/stores/useKeyStore'
import type { FilterStatus, SortField } from '@/lib/types'

const store = useKeyStore()

const filters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'success', label: '可用' },
  { value: 'error', label: '失败' },
  { value: 'idle', label: '待测' },
]

const sorts: { value: SortField; label: string }[] = [
  { value: null, label: '默认' },
  { value: 'latency', label: '总耗时' },
  { value: 'firstTokenLatency', label: '首字时间' },
]

const hasResults = computed(() => store.keyList.some((k) => k.status === 'success'))

import { computed } from 'vue'
</script>

<template>
  <n-space v-if="store.keyList.length > 0" style="margin-bottom: 12px" :size="4" align="center">
    <n-text v-for="f in filters" :key="f.value" depth="3" style="font-size: 12px">
      <n-button
        :type="store.filterStatus === f.value ? 'primary' : 'default'"
        size="tiny"
        quaternary
        @click="store.filterStatus = f.value"
      >
        {{ f.label }}
      </n-button>
    </n-text>

    <n-space v-if="hasResults" style="margin-left: auto" :size="4" align="center">
      <n-button
        v-for="s in sorts"
        :key="s.value ?? 'default'"
        :type="store.sortField === s.value ? 'primary' : 'default'"
        size="tiny"
        quaternary
        @click="store.setSortField(s.value)"
      >
        {{ s.label }}
      </n-button>
      <n-button
        v-if="store.sortField"
        size="tiny"
        quaternary
        @click="store.toggleSortDir"
      >
        {{ store.sortDir === 'asc' ? '↑' : '↓' }}
      </n-button>
    </n-space>
  </n-space>
</template>
