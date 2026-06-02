<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clipboard, Play, Trash2 } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatMs, truncateKey } from '../lib/format'
import type { KeyError, KeyItem, KeyStatus } from '../lib/types'
import { useKeyStore } from '../stores/useKeyStore'

const store = useKeyStore()
const { t } = useI18n()
const copyMessage = ref('')

const statusVariant: Record<KeyStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  idle: 'outline',
  testing: 'secondary',
  success: 'default',
  error: 'destructive',
}

let copyTimer: ReturnType<typeof window.setTimeout> | undefined

function statusLabel(status: KeyStatus) {
  return t(`keyTester.status.${status}`)
}

function errorText(error: KeyError) {
  return t(`keyTester.errors.${error}`)
}

async function handleCopyKey(key: string) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(key)
    } else {
      const ta = document.createElement('textarea')
      ta.value = key
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copyMessage.value = t('keyTester.copied')
  } catch {
    copyMessage.value = t('keyTester.copyFailed')
  }
  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

function handleRemove(item: KeyItem) {
  if (window.confirm(`${t('keyTester.removeConfirm')}\n${truncateKey(item.key)}`)) {
    store.removeKey(item.id)
  }
}
</script>

<template>
  <div v-if="store.keyList.length > 0" class="flex flex-col gap-3">
    <p v-if="copyMessage" class="text-sm text-muted-foreground" role="status">
      {{ copyMessage }}
    </p>

    <div class="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">#</TableHead>
            <TableHead>{{ t('keyTester.table.key') }}</TableHead>
            <TableHead>{{ t('keyTester.table.endpoint') }}</TableHead>
            <TableHead>{{ t('keyTester.table.model') }}</TableHead>
            <TableHead>{{ t('keyTester.table.note') }}</TableHead>
            <TableHead>{{ t('keyTester.table.status') }}</TableHead>
            <TableHead class="text-right">{{ t('keyTester.table.latency') }}</TableHead>
            <TableHead class="text-right">{{ t('keyTester.table.firstToken') }}</TableHead>
            <TableHead class="text-right">{{ t('keyTester.table.chunks') }}</TableHead>
            <TableHead>{{ t('keyTester.table.error') }}</TableHead>
            <TableHead class="text-right">{{ t('keyTester.table.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(item, index) in store.displayList" :key="item.id">
            <TableCell class="text-muted-foreground">{{ index + 1 }}</TableCell>
            <TableCell>
              <button
                class="inline-flex items-center gap-2 font-mono text-sm underline-offset-4 hover:underline"
                type="button"
                :title="t('keyTester.table.copyKey')"
                @click="handleCopyKey(item.key)"
              >
                <Clipboard />
                <span>{{ truncateKey(item.key) }}</span>
              </button>
            </TableCell>
            <TableCell class="max-w-64 truncate font-mono text-sm" :title="item.baseUrl">
              {{ item.baseUrl }}
            </TableCell>
            <TableCell class="max-w-44 truncate font-mono text-sm" :title="item.model">
              {{ item.model }}
            </TableCell>
            <TableCell class="max-w-44 truncate text-muted-foreground" :title="item.note || '-'">
              {{ item.note || '-' }}
            </TableCell>
            <TableCell>
              <Badge :variant="statusVariant[item.status]">{{ statusLabel(item.status) }}</Badge>
            </TableCell>
            <TableCell class="text-right font-mono text-sm">{{ formatMs(item.latency) }}</TableCell>
            <TableCell class="text-right font-mono text-sm">{{ formatMs(item.firstTokenLatency) }}</TableCell>
            <TableCell class="text-right font-mono text-sm">{{ item.tokens ?? '-' }}</TableCell>
            <TableCell class="max-w-64 text-destructive">
              <template v-if="item.error">
                <div class="truncate" :title="item.message || errorText(item.error)">
                  {{ errorText(item.error) }}
                </div>
                <div
                  v-if="item.message"
                  class="truncate text-xs text-muted-foreground"
                  :title="item.message"
                >
                  {{ item.message }}
                </div>
              </template>
            </TableCell>
            <TableCell>
              <div class="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="item.status === 'testing'"
                  @click="store.testOne(item)"
                >
                  <Play data-icon="inline-start" />
                  <span>{{ item.status === 'testing' ? '...' : t('keyTester.actions.test') }}</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  :disabled="item.status === 'testing'"
                  @click="handleRemove(item)"
                >
                  <Trash2 data-icon="inline-start" />
                  <span>{{ t('keyTester.actions.delete') }}</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>

  <div v-else class="rounded-md border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
    {{ t('keyTester.table.empty') }}
  </div>
</template>
