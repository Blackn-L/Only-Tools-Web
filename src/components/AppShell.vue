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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { localeOptions, saveLocale } from '@/i18n/locales'
import type { SupportedLocale } from '@/i18n/locales'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const isHome = computed(() => route.path === '/')
const activeToolTitle = computed(() => {
  locale.value
  const titleKey = route.meta.titleKey
  return typeof titleKey === 'string' ? t(titleKey) : ''
})
const activeToolDescription = computed(() => {
  locale.value
  const descriptionKey = route.meta.descriptionKey
  return typeof descriptionKey === 'string' ? t(descriptionKey) : ''
})
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
  <TooltipProvider>
    <div class="min-h-screen bg-muted/40 text-foreground">
      <header class="sticky top-0 border-b bg-background/95 backdrop-blur">
        <div class="mx-auto flex min-h-16 max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div class="flex w-full min-w-0 items-center gap-3 sm:flex-1">
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
            <div v-if="activeToolTitle" class="min-w-0 flex-1 border-l pl-3">
              <strong class="block truncate text-sm font-semibold">{{ activeToolTitle }}</strong>
              <Tooltip v-if="activeToolDescription">
                <TooltipTrigger as-child>
                  <small class="block truncate text-xs text-muted-foreground" tabindex="0">
                    {{ activeToolDescription }}
                  </small>
                </TooltipTrigger>
                <TooltipContent align="start" class="max-w-96 leading-relaxed" side="bottom">
                  {{ activeToolDescription }}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 sm:justify-end">
            <a
              aria-label="GitHub: Blackn-L/Only-Tools-Web"
              class="inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground"
              href="https://github.com/Blackn-L/Only-Tools-Web"
              rel="noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                class="size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
              </svg>
            </a>
            <Select v-model="currentLocale">
              <SelectTrigger class="w-[78px]" size="sm" :aria-label="t('app.language')">
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
  </TooltipProvider>
</template>
