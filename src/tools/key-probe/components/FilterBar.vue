<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import type { FilterStatus, SortField } from '../lib/types'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()

const filters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'success', label: 'Available' },
  { value: 'error', label: 'Failed' },
  { value: 'idle', label: 'Idle' },
]

const sorts: { value: SortField; label: string }[] = [
  { value: null, label: 'Default' },
  { value: 'latency', label: 'Latency' },
  { value: 'firstTokenLatency', label: 'First token' },
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
        {{ filter.label }}
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
        {{ sort.label }}
      </n-button>
      <n-button v-if="store.sortField" size="tiny" secondary @click="store.toggleSortDir">
        {{ store.sortDir === 'asc' ? 'Asc' : 'Desc' }}
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
