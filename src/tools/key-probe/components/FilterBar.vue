<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDownUp } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { FilterStatus, SortField } from '../lib/types'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()

const filters: { value: FilterStatus; labelKey: string }[] = [
  { value: 'all', labelKey: 'keyTester.filters.all' },
  { value: 'success', labelKey: 'keyTester.filters.available' },
  { value: 'error', labelKey: 'keyTester.filters.failed' },
  { value: 'idle', labelKey: 'keyTester.filters.idle' },
]

const sorts: { value: SortField; labelKey: string }[] = [
  { value: null, labelKey: 'keyTester.filters.default' },
  { value: 'latency', labelKey: 'keyTester.filters.latency' },
  { value: 'firstTokenLatency', labelKey: 'keyTester.filters.firstToken' },
]

const hasResults = computed(() => store.keyList.some((k) => k.status === 'success'))
</script>

<template>
  <div v-if="store.keyList.length > 0" class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="filter in filters"
        :key="filter.value"
        :variant="store.filterStatus === filter.value ? 'default' : 'outline'"
        size="sm"
        :aria-pressed="store.filterStatus === filter.value"
        @click="store.filterStatus = filter.value"
      >
        {{ t(filter.labelKey) }}
      </Button>
    </div>

    <div v-if="hasResults" class="flex flex-wrap gap-2">
      <Button
        v-for="sort in sorts"
        :key="sort.value ?? 'default'"
        :variant="store.sortField === sort.value ? 'default' : 'outline'"
        size="sm"
        :aria-pressed="store.sortField === sort.value"
        @click="store.setSortField(sort.value)"
      >
        {{ t(sort.labelKey) }}
      </Button>
      <Button v-if="store.sortField" variant="outline" size="sm" @click="store.toggleSortDir">
        <ArrowDownUp data-icon="inline-start" />
        <span>{{ store.sortDir === 'asc' ? t('keyTester.filters.asc') : t('keyTester.filters.desc') }}</span>
      </Button>
    </div>
  </div>
</template>
