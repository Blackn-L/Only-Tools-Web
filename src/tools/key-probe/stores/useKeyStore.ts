import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { FilterStatus, KeyItem, SortDir, SortField } from '../lib/types'
import { batchTest } from '../lib/batchTest'
import { testKey } from '../lib/testKey'

const STORAGE_KEY = 'only-tools-web:key-tester'

type StoredState = {
  keys?: KeyItem[]
  concurrency?: number
  rememberKeys?: boolean
}

function loadFromStorage(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(keys: KeyItem[], concurrency: number, rememberKeys: boolean) {
  const safeKeys = rememberKeys
    ? keys.map(({ id, key, note, baseUrl, model, status, latency, firstTokenLatency, tokens, error }) => ({
        id,
        key,
        note,
        baseUrl,
        model,
        status,
        latency,
        firstTokenLatency,
        tokens,
        error,
      }))
    : []

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      keys: safeKeys,
      concurrency,
      rememberKeys,
    }),
  )
}

let nextId = 1

export const useKeyStore = defineStore('keys', () => {
  const saved = loadFromStorage()
  const rememberKeys = ref(saved.rememberKeys === true)
  const keyList = ref<KeyItem[]>(rememberKeys.value ? (saved.keys ?? []) : [])
  nextId = keyList.value.length > 0 ? Math.max(...keyList.value.map((k) => Number(k.id))) + 1 : 1

  const concurrency = ref(saved.concurrency ?? 5)
  const isRunning = ref(false)
  const filterStatus = ref<FilterStatus>('all')
  const sortField = ref<SortField>(null)
  const sortDir = ref<SortDir>('asc')

  watch(
    [keyList, concurrency, rememberKeys],
    () => {
      saveToStorage(keyList.value, concurrency.value, rememberKeys.value)
    },
    { deep: true },
  )

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

  function addKey(key: string, note: string, baseUrl: string, model: string) {
    keyList.value.push({
      id: String(nextId++),
      key: key.trim(),
      note: note.trim(),
      baseUrl: baseUrl.trim(),
      model: model.trim(),
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
    localStorage.removeItem(STORAGE_KEY)
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
    const result = await testKey(item.key, item.baseUrl, item.model)
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

  return {
    keyList,
    concurrency,
    rememberKeys,
    isRunning,
    filterStatus,
    sortField,
    sortDir,
    idleKeys,
    failedKeys,
    displayList,
    stats,
    addKey,
    removeKey,
    updateKey,
    reset,
    setSortField,
    toggleSortDir,
    testOne,
    testAll,
    testFailed,
  }
})
