import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { KeyItem, FilterStatus, SortField, SortDir } from '@/lib/types'
import { testKey } from '@/lib/testKey'
import { batchTest } from '@/lib/batchTest'

const STORAGE_KEY = 'key-probe-data'

function loadFromStorage(): { keys: KeyItem[]; concurrency: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { keys: [], concurrency: 5 }
}

function saveToStorage(keys: KeyItem[], concurrency: number) {
  const data = keys.map(({ id, key, note, baseUrl, status, latency, firstTokenLatency, tokens, error }) => ({
    id, key, note, baseUrl, status, latency, firstTokenLatency, tokens, error,
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ keys: data, concurrency }))
}

let nextId = 1

export const useKeyStore = defineStore('keys', () => {
  const saved = loadFromStorage()
  nextId = saved.keys.length > 0 ? Math.max(...saved.keys.map((k) => Number(k.id))) + 1 : 1

  const keyList = ref<KeyItem[]>(saved.keys)
  const concurrency = ref(saved.concurrency)
  const isRunning = ref(false)
  const filterStatus = ref<FilterStatus>('all')
  const sortField = ref<SortField>(null)
  const sortDir = ref<SortDir>('asc')

  watch([keyList, concurrency], () => {
    saveToStorage(keyList.value, concurrency.value)
  }, { deep: true })

  const idleKeys = computed(() => keyList.value.filter((k) => k.status === 'idle'))
  const failedKeys = computed(() => keyList.value.filter((k) => k.status === 'error'))

  const displayList = computed(() => {
    let list = keyList.value
    if (filterStatus.value !== 'all') {
      list = list.filter((k) => k.status === filterStatus.value)
    }
    if (sortField.value) {
      list = [...list].sort((a, b) => {
        const av = a[sortField.value!] ?? (sortDir.value === 'asc' ? Infinity : -Infinity)
        const bv = b[sortField.value!] ?? (sortDir.value === 'asc' ? Infinity : -Infinity)
        return sortDir.value === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
      })
    }
    return list
  })

  const stats = computed(() => {
    const total = keyList.value.length
    const success = keyList.value.filter((k) => k.status === 'success').length
    const error = keyList.value.filter((k) => k.status === 'error').length
    const testing = keyList.value.filter((k) => k.status === 'testing').length
    const successKeys = keyList.value.filter((k) => k.status === 'success')
    const avgLatency =
      successKeys.length > 0
        ? successKeys.reduce((s, k) => s + (k.latency ?? 0), 0) / successKeys.length
        : 0
    const avgFirstToken =
      successKeys.length > 0
        ? successKeys.reduce((s, k) => s + (k.firstTokenLatency ?? 0), 0) / successKeys.length
        : 0
    return { total, success, error, testing, avgLatency, avgFirstToken }
  })

  function addKey(key: string, note: string, baseUrl?: string) {
    keyList.value.push({
      id: String(nextId++),
      key: key.trim(),
      note: note.trim(),
      baseUrl: baseUrl?.trim() || undefined,
      status: 'idle',
    })
  }

  function removeKey(id: string) {
    keyList.value = keyList.value.filter((item) => item.id !== id)
  }

  function updateKey(id: string, data: Partial<KeyItem>) {
    const item = keyList.value.find((k) => k.id === id)
    if (item) Object.assign(item, data)
  }

  function reset() {
    keyList.value = []
    isRunning.value = false
    concurrency.value = 5
    filterStatus.value = 'all'
    sortField.value = null
    sortDir.value = 'asc'
  }

  function setSortField(f: SortField) {
    if (sortField.value === f) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = f
      sortDir.value = 'asc'
    }
  }

  function toggleSortDir() {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  }

  async function testOne(item: KeyItem) {
    updateKey(item.id, { status: 'testing' })
    const result = await testKey(item.key, item.baseUrl)
    updateKey(item.id, result)
  }

  async function testAll() {
    if (keyList.value.length === 0 || isRunning.value) return
    keyList.value.forEach((k) => {
      k.status = 'idle'
      k.latency = undefined
      k.firstTokenLatency = undefined
      k.tokens = undefined
      k.error = undefined
    })
    isRunning.value = true
    await batchTest(keyList.value, concurrency.value, (id, data) => updateKey(id, data), () => {
      isRunning.value = false
    })
  }

  async function testFailed() {
    const keys = failedKeys.value
    if (keys.length === 0 || isRunning.value) return
    isRunning.value = true
    await batchTest(keys, concurrency.value, (id, data) => updateKey(id, data), () => {
      isRunning.value = false
    })
  }

  function getCCSwitchConfig(key: string, baseUrl?: string): string {
    const base = (baseUrl || 'https://token-plan-cn.xiaomimimo.com').replace(/\/+$/, '')
    return JSON.stringify({
      effortLevel: 'high',
      env: {
        ANTHROPIC_AUTH_TOKEN: key,
        ANTHROPIC_BASE_URL: `${base}/anthropic`,
        ANTHROPIC_DEFAULT_HAIKU_MODEL: 'mimo-v2.5-pro[1m]',
        ANTHROPIC_DEFAULT_OPUS_MODEL: 'mimo-v2.5-pro[1m]',
        ANTHROPIC_DEFAULT_SONNET_MODEL: 'mimo-v2.5-pro[1m]',
        ANTHROPIC_MODEL: 'mimo-v2.5-pro[1m]',
      },
      includeCoAuthoredBy: false,
      model: 'opus[1m]',
    }, null, 2)
  }

  function copyCCSwitchConfig(key: string, baseUrl?: string) {
    const config = getCCSwitchConfig(key, baseUrl)
    navigator.clipboard.writeText(config)
  }

  return {
    keyList, concurrency, isRunning, filterStatus, sortField, sortDir,
    idleKeys, failedKeys, displayList, stats,
    addKey, removeKey, updateKey, reset,
    setSortField, toggleSortDir,
    testOne, testAll, testFailed,
    getCCSwitchConfig, copyCCSwitchConfig,
  }
})
