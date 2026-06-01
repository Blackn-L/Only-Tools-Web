<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { localeOptions, saveLocale } from '@/i18n/locales'
import type { SupportedLocale } from '@/i18n/locales'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const isHome = computed(() => route.path === '/')
const currentLocale = computed({
  get: () => locale.value as SupportedLocale,
  set: (value: SupportedLocale) => {
    locale.value = value
    saveLocale(value)
  },
})

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-muted/40 text-foreground">
    <header class="sticky top-0 border-b bg-background/95 backdrop-blur">
      <div class="mx-auto flex min-h-16 max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <Button v-if="!isHome" variant="outline" size="sm" @click="goHome">
            <ArrowLeft data-icon="inline-start" />
            <span>{{ t('app.back') }}</span>
          </Button>
          <RouterLink class="flex min-w-0 items-center gap-3 text-foreground no-underline" to="/">
            <span class="grid size-9 shrink-0 place-items-center rounded-md border border-primary text-sm font-semibold text-primary">
              O
            </span>
            <span class="min-w-0">
              <strong class="block truncate text-sm font-semibold sm:text-base">Only Tools Web</strong>
              <small class="block truncate text-xs text-muted-foreground">{{ t('app.subtitle') }}</small>
            </span>
          </RouterLink>
        </div>

        <div class="flex items-center justify-between gap-3 sm:justify-end">
          <span class="hidden text-sm text-muted-foreground sm:inline">{{ t('app.localFirst') }}</span>
          <Select v-model="currentLocale">
            <SelectTrigger class="w-[132px]" size="sm" :aria-label="t('app.language')">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="option in localeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
