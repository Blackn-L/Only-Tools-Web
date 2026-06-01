<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton } from 'naive-ui'
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
  <div v-if="store.keyList.length > 0" class="filter-bar">
    <div class="filter-bar__group">
      <n-button
        v-for="filter in filters"
        :key="filter.value"
        :type="store.filterStatus === filter.value ? 'primary' : 'default'"
        size="tiny"
        secondary
        @click="store.filterStatus = filter.value"
      >
        {{ t(filter.labelKey) }}
      </n-button>
    </div>

    <div v-if="hasResults" class="filter-bar__group">
      <n-button
        v-for="sort in sorts"
        :key="sort.value ?? 'default'"
        :type="store.sortField === sort.value ? 'primary' : 'default'"
        size="tiny"
        secondary
        @click="store.setSortField(sort.value)"
      >
        {{ t(sort.labelKey) }}
      </n-button>
      <n-button v-if="store.sortField" size="tiny" secondary @click="store.toggleSortDir">
        {{ store.sortDir === 'asc' ? t('keyTester.filters.asc') : t('keyTester.filters.desc') }}
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-bar__group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 760px) {
  .filter-bar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
