<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Clipboard, Import, Pencil, Play, Save, Trash2 } from '@lucide/vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CCSWITCH_APPS,
  CCSWITCH_APP_LABELS,
  openCcswitch,
  toCcswitchProvider,
  type CcswitchApp,
} from '../lib/ccswitch';
import { formatMs, truncateKey } from '../lib/format';
import { PROTOCOL_LABELS, PROTOCOL_OPTIONS } from '../lib/protocols';
import type { ApiProtocol, KeyError, KeyItem, KeyStatus } from '../lib/types';
import { useKeyStore } from '../stores/useKeyStore';

const store = useKeyStore();
const { t } = useI18n();
const copyMessage = ref('');

const editingId = ref<string | null>(null);
const form = reactive({
  key: '',
  baseUrl: '',
  model: '',
  note: '',
  protocol: 'openai' as ApiProtocol,
});

const isEditOpen = computed({
  get: () => editingId.value !== null,
  set: (open: boolean) => {
    if (!open) editingId.value = null;
  },
});

const canSave = computed(
  () => form.key.trim() !== '' && form.baseUrl.trim() !== '' && form.model.trim() !== '',
);

const editBaseUrlPlaceholder = computed(() =>
  t(form.protocol === 'anthropic' ? 'keyTester.baseUrlAnthropic' : 'keyTester.baseUrlOpenai'),
);

const importingItem = ref<KeyItem | null>(null);
const importApp = ref<CcswitchApp>(store.ccswitchApp);

const isImportOpen = computed({
  get: () => importingItem.value !== null,
  set: (open: boolean) => {
    if (!open) importingItem.value = null;
  },
});

const importPreview = computed(() =>
  importingItem.value ? toCcswitchProvider(importingItem.value) : null,
);

const statusVariant: Record<KeyStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  idle: 'outline',
  testing: 'secondary',
  success: 'default',
  error: 'destructive',
};

let copyTimer: ReturnType<typeof window.setTimeout> | undefined;

function statusLabel(status: KeyStatus) {
  return t(`keyTester.status.${status}`);
}

function errorText(error: KeyError) {
  return t(`keyTester.errors.${error}`);
}

function errorTitle(item: KeyItem) {
  if (!item.error) return '';
  const label = errorText(item.error);
  return item.message ? `${label}：${item.message}` : label;
}

function setEditProtocol(value: unknown) {
  if (value === 'openai' || value === 'anthropic') {
    form.protocol = value;
  }
}

async function handleCopy(value: string, label: string) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
    } else {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copyMessage.value = t('keyTester.copied', { label });
  } catch {
    copyMessage.value = t('keyTester.copyFailed');
  }
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copyMessage.value = '';
  }, 2000);
}

function handleRemove(item: KeyItem) {
  if (window.confirm(`${t('keyTester.removeConfirm')}\n${truncateKey(item.key)}`)) {
    store.removeKey(item.id);
  }
}

function startEdit(item: KeyItem) {
  editingId.value = item.id;
  form.key = item.key;
  form.baseUrl = item.baseUrl;
  form.model = item.model;
  form.note = item.note;
  form.protocol = item.protocol;
}

function saveEdit() {
  if (!editingId.value || !canSave.value) return;

  const id = editingId.value;
  const current = store.keyList.find(k => k.id === id);
  const key = form.key.trim();
  const baseUrl = form.baseUrl.trim();
  const model = form.model.trim();
  const protocol = form.protocol;
  const data: Partial<KeyItem> = { key, baseUrl, model, note: form.note.trim(), protocol };

  // Stale test results no longer describe the new key/endpoint/model/protocol — clear them.
  if (
    current &&
    (current.key !== key ||
      current.baseUrl !== baseUrl ||
      current.model !== model ||
      current.protocol !== protocol)
  ) {
    data.status = 'idle';
    data.latency = undefined;
    data.firstTokenLatency = undefined;
    data.tokens = undefined;
    data.error = undefined;
    data.message = undefined;
  }

  store.updateKey(id, data);
  editingId.value = null;
}

function startImport(item: KeyItem) {
  importingItem.value = item;
  importApp.value = store.ccswitchApp;
}

function setImportApp(value: unknown) {
  if (value === 'claude' || value === 'codex') {
    importApp.value = value;
  }
}

function confirmImport() {
  if (!importingItem.value) return;
  store.ccswitchApp = importApp.value;
  openCcswitch(importingItem.value, importApp.value);
  importingItem.value = null;
}
</script>

<template>
  <div v-if="store.keyList.length > 0" class="flex flex-col gap-3">
    <div class="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-10">#</TableHead>
            <TableHead>{{ t('keyTester.table.keyEndpoint') }}</TableHead>
            <TableHead>{{ t('keyTester.table.modelStatus') }}</TableHead>
            <TableHead>{{ t('keyTester.table.metrics') }}</TableHead>
            <TableHead>{{ t('keyTester.table.note') }}</TableHead>
            <TableHead>{{ t('keyTester.table.error') }}</TableHead>
            <TableHead>{{ t('keyTester.table.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(item, index) in store.displayList" :key="item.id">
            <TableCell class="align-top text-muted-foreground">{{ index + 1 }}</TableCell>

            <TableCell class="max-w-56 align-top">
              <div class="flex flex-col gap-0.5">
                <button
                  class="inline-flex max-w-full items-center gap-2 font-mono text-sm underline-offset-4 hover:underline"
                  type="button"
                  :title="t('keyTester.table.copyKey')"
                  @click="handleCopy(item.key, t('keyTester.table.key'))"
                >
                  <Clipboard class="shrink-0" />
                  <span class="truncate">{{ truncateKey(item.key) }}</span>
                </button>
                <button
                  class="block max-w-full truncate text-left font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
                  type="button"
                  :title="item.baseUrl"
                  @click="handleCopy(item.baseUrl, t('keyTester.table.endpoint'))"
                >
                  {{ item.baseUrl }}
                </button>
              </div>
            </TableCell>

            <TableCell class="max-w-40 align-top">
              <div class="flex flex-col gap-1">
                <button
                  class="block max-w-full truncate text-left font-mono text-sm underline-offset-4 hover:underline"
                  type="button"
                  :title="item.model"
                  @click="handleCopy(item.model, t('keyTester.table.model'))"
                >
                  {{ item.model }}
                </button>
                <div class="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary">{{ PROTOCOL_LABELS[item.protocol] }}</Badge>
                  <Badge :variant="statusVariant[item.status]">{{
                    statusLabel(item.status)
                  }}</Badge>
                </div>
              </div>
            </TableCell>

            <TableCell class="align-top">
              <div class="flex flex-col gap-0.5 font-mono text-xs text-muted-foreground">
                <span>{{ t('keyTester.table.latency') }} {{ formatMs(item.latency) }}</span>
                <span
                  >{{ t('keyTester.table.firstToken') }}
                  {{ formatMs(item.firstTokenLatency) }}</span
                >
                <span>{{ t('keyTester.table.chunks') }} {{ item.tokens ?? '-' }}</span>
              </div>
            </TableCell>

            <TableCell
              class="max-w-32 align-top truncate text-muted-foreground"
              :title="item.note || '-'"
            >
              {{ item.note || '-' }}
            </TableCell>

            <TableCell class="max-w-48 align-top text-destructive">
              <div v-if="item.error" class="truncate" :title="errorTitle(item)">
                {{ errorText(item.error) }}
              </div>
            </TableCell>

            <TableCell class="align-top">
              <div class="grid grid-cols-2 gap-1.5 min-w-60">
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
                  variant="outline"
                  size="sm"
                  :title="t('keyTester.ccswitch.import')"
                  @click="startImport(item)"
                >
                  <Import />
                  <span>CC Switch</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="item.status === 'testing'"
                  @click="startEdit(item)"
                >
                  <Pencil data-icon="inline-start" />
                  <span>{{ t('keyTester.actions.edit') }}</span>
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

    <Dialog v-model:open="isEditOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ t('keyTester.edit.title') }}</DialogTitle>
        </DialogHeader>
        <form class="flex flex-col gap-4" @submit.prevent="saveEdit">
          <label class="flex flex-col gap-2 text-sm font-medium">
            <span>{{ t('keyTester.table.key') }}</span>
            <Input v-model="form.key" autocomplete="off" :placeholder="t('keyTester.apiKey')" />
          </label>
          <label class="flex flex-col gap-2 text-sm font-medium">
            <span>{{ t('keyTester.table.endpoint') }}</span>
            <Input v-model="form.baseUrl" type="url" :placeholder="editBaseUrlPlaceholder" />
          </label>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="flex flex-col gap-2 text-sm font-medium">
              <span>{{ t('keyTester.table.model') }}</span>
              <Input v-model="form.model" :placeholder="t('keyTester.model')" />
            </label>
            <label class="flex flex-col gap-2 text-sm font-medium">
              <span>{{ t('keyTester.table.protocol') }}</span>
              <Select :model-value="form.protocol" @update:model-value="setEditProtocol">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="p in PROTOCOL_OPTIONS" :key="p" :value="p">
                      {{ PROTOCOL_LABELS[p] }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          </div>
          <label class="flex flex-col gap-2 text-sm font-medium">
            <span>{{ t('keyTester.table.note') }}</span>
            <Input v-model="form.note" :placeholder="t('keyTester.note')" />
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" @click="isEditOpen = false">
              {{ t('keyTester.edit.cancel') }}
            </Button>
            <Button type="submit" :disabled="!canSave">
              <Save data-icon="inline-start" />
              <span>{{ t('keyTester.edit.save') }}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isImportOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ t('keyTester.ccswitch.title') }}</DialogTitle>
        </DialogHeader>
        <div v-if="importPreview" class="flex flex-col gap-4">
          <label class="flex flex-col gap-2 text-sm font-medium">
            <span>{{ t('keyTester.ccswitch.target') }}</span>
            <Select :model-value="importApp" @update:model-value="setImportApp">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="app in CCSWITCH_APPS" :key="app" :value="app">
                    {{ CCSWITCH_APP_LABELS[app] }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium">{{ t('keyTester.ccswitch.preview') }}</span>
            <dl
              class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border bg-muted/40 px-4 py-3 text-sm"
            >
              <dt class="text-muted-foreground">{{ t('keyTester.ccswitch.name') }}</dt>
              <dd class="break-all">{{ importPreview.name }}</dd>
              <dt class="text-muted-foreground">{{ t('keyTester.table.endpoint') }}</dt>
              <dd class="break-all font-mono">{{ importPreview.endpoint }}</dd>
              <dt class="text-muted-foreground">{{ t('keyTester.table.key') }}</dt>
              <dd class="break-all font-mono">{{ truncateKey(importPreview.apiKey) }}</dd>
              <dt class="text-muted-foreground">{{ t('keyTester.table.model') }}</dt>
              <dd class="break-all font-mono">{{ importPreview.model }}</dd>
              <dt class="text-muted-foreground">{{ t('keyTester.table.note') }}</dt>
              <dd class="break-all">{{ importPreview.notes || '-' }}</dd>
            </dl>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="isImportOpen = false">
            {{ t('keyTester.edit.cancel') }}
          </Button>
          <Button type="button" @click="confirmImport">
            <Import data-icon="inline-start" />
            <span>{{ t('keyTester.ccswitch.confirm') }}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>

  <div
    v-else
    class="rounded-md border bg-card px-4 py-16 text-center text-sm text-muted-foreground"
  >
    {{ t('keyTester.table.empty') }}
  </div>

  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="copyMessage"
        class="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-sm text-background shadow-lg"
        role="status"
      >
        {{ copyMessage }}
      </div>
    </Transition>
  </Teleport>
</template>
