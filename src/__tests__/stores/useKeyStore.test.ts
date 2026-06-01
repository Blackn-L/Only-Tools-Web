import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useKeyStore } from '@/stores/useKeyStore'

vi.mock('@/lib/testKey', () => ({
  testKey: vi.fn(),
}))
vi.mock('@/lib/batchTest', () => ({
  batchTest: vi.fn(),
}))

import { testKey } from '@/lib/testKey'
import { batchTest } from '@/lib/batchTest'

describe('useKeyStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  describe('addKey', () => {
    it('adds a key with note', () => {
      const store = useKeyStore()
      store.addKey('tp-test', 'my note')
      expect(store.keyList).toHaveLength(1)
      expect(store.keyList[0].key).toBe('tp-test')
      expect(store.keyList[0].note).toBe('my note')
      expect(store.keyList[0].status).toBe('idle')
    })

    it('trims key and note', () => {
      const store = useKeyStore()
      store.addKey('  tp-test  ', '  note  ')
      expect(store.keyList[0].key).toBe('tp-test')
      expect(store.keyList[0].note).toBe('note')
    })

    it('assigns unique ids', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      expect(store.keyList[0].id).not.toBe(store.keyList[1].id)
    })

    it('stores baseUrl when provided', () => {
      const store = useKeyStore()
      store.addKey('tp-test', '', 'https://custom.example.com')
      expect(store.keyList[0].baseUrl).toBe('https://custom.example.com')
    })

    it('stores undefined baseUrl when not provided', () => {
      const store = useKeyStore()
      store.addKey('tp-test', '')
      expect(store.keyList[0].baseUrl).toBeUndefined()
    })

    it('stores undefined baseUrl when empty string provided', () => {
      const store = useKeyStore()
      store.addKey('tp-test', '', '  ')
      expect(store.keyList[0].baseUrl).toBeUndefined()
    })

    it('trims baseUrl', () => {
      const store = useKeyStore()
      store.addKey('tp-test', '', '  https://custom.example.com  ')
      expect(store.keyList[0].baseUrl).toBe('https://custom.example.com')
    })
  })

  describe('removeKey', () => {
    it('removes key by id', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      const id = store.keyList[0].id
      store.removeKey(id)
      expect(store.keyList).toHaveLength(1)
      expect(store.keyList[0].key).toBe('tp-b')
    })

    it('does nothing for non-existent id', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.removeKey('nonexistent')
      expect(store.keyList).toHaveLength(1)
    })
  })

  describe('updateKey', () => {
    it('updates key data by id', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      const id = store.keyList[0].id
      store.updateKey(id, { status: 'success', latency: 100 })
      expect(store.keyList[0].status).toBe('success')
      expect(store.keyList[0].latency).toBe(100)
    })

    it('preserves unmodified fields', () => {
      const store = useKeyStore()
      store.addKey('tp-a', 'note')
      const id = store.keyList[0].id
      store.updateKey(id, { status: 'testing' })
      expect(store.keyList[0].key).toBe('tp-a')
      expect(store.keyList[0].note).toBe('note')
    })

    it('does nothing for non-existent id', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.updateKey('nonexistent', { status: 'success' })
      expect(store.keyList[0].status).toBe('idle')
    })
  })

  describe('reset', () => {
    it('clears all state', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.concurrency = 10
      store.filterStatus = 'success'
      store.setSortField('latency')
      store.reset()
      expect(store.keyList).toEqual([])
      expect(store.isRunning).toBe(false)
      expect(store.concurrency).toBe(5)
      expect(store.filterStatus).toBe('all')
      expect(store.sortField).toBeNull()
      expect(store.sortDir).toBe('asc')
    })
  })

  describe('setSortField', () => {
    it('sets sort field', () => {
      const store = useKeyStore()
      store.setSortField('latency')
      expect(store.sortField).toBe('latency')
    })

    it('toggles sort dir when same field clicked again', () => {
      const store = useKeyStore()
      store.setSortField('latency')
      expect(store.sortDir).toBe('asc')
      store.setSortField('latency')
      expect(store.sortDir).toBe('desc')
    })

    it('resets to asc when different field clicked', () => {
      const store = useKeyStore()
      store.setSortField('latency')
      store.setSortField('latency')
      expect(store.sortDir).toBe('desc')
      store.setSortField('firstTokenLatency')
      expect(store.sortDir).toBe('asc')
    })
  })

  describe('toggleSortDir', () => {
    it('toggles between asc and desc', () => {
      const store = useKeyStore()
      expect(store.sortDir).toBe('asc')
      store.toggleSortDir()
      expect(store.sortDir).toBe('desc')
      store.toggleSortDir()
      expect(store.sortDir).toBe('asc')
    })
  })

  describe('computed', () => {
    it('idleKeys returns only idle items', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      store.updateKey(store.keyList[0].id, { status: 'success' })
      expect(store.idleKeys).toHaveLength(1)
      expect(store.idleKeys[0].key).toBe('tp-b')
    })

    it('failedKeys returns only error items', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      store.updateKey(store.keyList[0].id, { status: 'error', error: 'invalid_key' })
      expect(store.failedKeys).toHaveLength(1)
      expect(store.failedKeys[0].key).toBe('tp-a')
    })

    it('displayList respects filter', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      store.updateKey(store.keyList[0].id, { status: 'success' })
      store.filterStatus = 'success'
      expect(store.displayList).toHaveLength(1)
      expect(store.displayList[0].key).toBe('tp-a')
    })

    it('displayList respects sort', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      store.updateKey(store.keyList[0].id, { status: 'success', latency: 200 })
      store.updateKey(store.keyList[1].id, { status: 'success', latency: 100 })
      store.setSortField('latency')
      expect(store.displayList[0].latency).toBe(100)
      expect(store.displayList[1].latency).toBe(200)
    })

    it('stats computes correctly', () => {
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')
      store.addKey('tp-c', '')
      store.updateKey(store.keyList[0].id, { status: 'success', latency: 100, firstTokenLatency: 50 })
      store.updateKey(store.keyList[1].id, { status: 'error', error: 'invalid_key' })
      // tp-c stays idle
      expect(store.stats.total).toBe(3)
      expect(store.stats.success).toBe(1)
      expect(store.stats.error).toBe(1)
      expect(store.stats.testing).toBe(0)
      expect(store.stats.avgLatency).toBe(100)
      expect(store.stats.avgFirstToken).toBe(50)
    })
  })

  describe('default state', () => {
    it('has correct initial values', () => {
      const store = useKeyStore()
      expect(store.keyList).toEqual([])
      expect(store.concurrency).toBe(5)
      expect(store.isRunning).toBe(false)
      expect(store.filterStatus).toBe('all')
      expect(store.sortField).toBeNull()
      expect(store.sortDir).toBe('asc')
    })
  })

  describe('testOne', () => {
    it('sets testing status then updates with result', async () => {
      vi.mocked(testKey).mockResolvedValue({ key: 'tp-a', status: 'success', latency: 100, tokens: 1 })
      const store = useKeyStore()
      store.addKey('tp-a', '')
      const item = store.keyList[0]

      await store.testOne(item)

      expect(store.keyList[0].status).toBe('success')
      expect(store.keyList[0].latency).toBe(100)
    })
  })

  describe('testAll', () => {
    it('calls batchTest with idle keys', async () => {
      vi.mocked(batchTest).mockImplementation(async (_items, _c, _onUpdate, onDone) => { onDone() })
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.addKey('tp-b', '')

      await store.testAll()

      expect(batchTest).toHaveBeenCalled()
      expect(store.isRunning).toBe(false)
    })

    it('does nothing when no idle keys', async () => {
      vi.mocked(batchTest).mockClear()
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.updateKey(store.keyList[0].id, { status: 'success' })

      await store.testAll()

      expect(batchTest).not.toHaveBeenCalled()
    })

    it('does nothing when already running', async () => {
      vi.mocked(batchTest).mockClear()
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.isRunning = true

      await store.testAll()

      expect(batchTest).not.toHaveBeenCalled()
    })
  })

  describe('testFailed', () => {
    it('calls batchTest with failed keys', async () => {
      vi.mocked(batchTest).mockImplementation(async (_items, _c, _onUpdate, onDone) => { onDone() })
      const store = useKeyStore()
      store.addKey('tp-a', '')
      store.updateKey(store.keyList[0].id, { status: 'error', error: 'invalid_key' })

      await store.testFailed()

      expect(batchTest).toHaveBeenCalled()
      expect(store.isRunning).toBe(false)
    })

    it('does nothing when no failed keys', async () => {
      vi.mocked(batchTest).mockClear()
      const store = useKeyStore()
      store.addKey('tp-a', '')

      await store.testFailed()

      expect(batchTest).not.toHaveBeenCalled()
    })
  })

  describe('getCCSwitchConfig', () => {
    it('uses default base URL when not provided', () => {
      const store = useKeyStore()
      const config = JSON.parse(store.getCCSwitchConfig('tp-test'))
      expect(config.env.ANTHROPIC_BASE_URL).toBe('https://token-plan-cn.xiaomimimo.com/anthropic')
    })

    it('uses custom base URL when provided', () => {
      const store = useKeyStore()
      const config = JSON.parse(store.getCCSwitchConfig('tp-test', 'https://custom.example.com'))
      expect(config.env.ANTHROPIC_BASE_URL).toBe('https://custom.example.com/anthropic')
    })

    it('strips trailing slashes from base URL', () => {
      const store = useKeyStore()
      const config = JSON.parse(store.getCCSwitchConfig('tp-test', 'https://custom.example.com///'))
      expect(config.env.ANTHROPIC_BASE_URL).toBe('https://custom.example.com/anthropic')
    })

    it('sets the auth token correctly', () => {
      const store = useKeyStore()
      const config = JSON.parse(store.getCCSwitchConfig('tp-mykey'))
      expect(config.env.ANTHROPIC_AUTH_TOKEN).toBe('tp-mykey')
    })
  })

  describe('localStorage persistence', () => {
    it('persists baseUrl to localStorage', async () => {
      const { nextTick } = await import('vue')
      const store = useKeyStore()
      store.addKey('tp-test', 'note', 'https://custom.example.com')
      await nextTick()

      const raw = localStorage.getItem('key-probe-data')
      const parsed = JSON.parse(raw!)
      expect(parsed.keys[0].baseUrl).toBe('https://custom.example.com')
    })

    it('loads baseUrl from localStorage', () => {
      localStorage.setItem('key-probe-data', JSON.stringify({
        keys: [{ id: '1', key: 'tp-test', note: '', baseUrl: 'https://loaded.example.com', status: 'idle' }],
        concurrency: 5,
      }))
      setActivePinia(createPinia())
      const store = useKeyStore()
      expect(store.keyList[0].baseUrl).toBe('https://loaded.example.com')
    })
  })
})
