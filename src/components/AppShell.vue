<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Languages, Monitor, Moon, Sun } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { saveLocale } from '@/i18n/locales'
import type { SupportedLocale } from '@/i18n/locales'

type ThemeMode = 'system' | 'light' | 'dark'

const themeStorageKey = 'only-tools-web:theme'
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const themeMode = ref<ThemeMode>('system')
let systemThemeQuery: MediaQueryList | null = null

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
const currentLocale = computed(() => locale.value as SupportedLocale)
const nextLocale = computed<SupportedLocale>(() => (currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN'))
const languageToggleLabel = computed(() => (
  nextLocale.value === 'zh-CN' ? t('app.switchToChinese') : t('app.switchToEnglish')
))

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function shouldUseDarkTheme(mode: ThemeMode) {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return systemThemeQuery?.matches ?? false
}

function applyTheme(mode: ThemeMode) {
  const isDark = shouldUseDarkTheme(mode)
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

function setTheme(mode: ThemeMode) {
  themeMode.value = mode
  if (mode === 'system') {
    localStorage.removeItem(themeStorageKey)
  } else {
    localStorage.setItem(themeStorageKey, mode)
  }
  applyTheme(mode)
}

function handleSystemThemeChange() {
  if (themeMode.value === 'system') {
    applyTheme('system')
  }
}

onMounted(() => {
  systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const savedTheme = localStorage.getItem(themeStorageKey)
  themeMode.value = isThemeMode(savedTheme) ? savedTheme : 'system'
  applyTheme(themeMode.value)
  systemThemeQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  systemThemeQuery?.removeEventListener('change', handleSystemThemeChange)
})

function goHome() {
  router.push('/')
}

function toggleLocale() {
  locale.value = nextLocale.value
  saveLocale(nextLocale.value)
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
            <div class="flex items-center gap-1 rounded-md border border-input bg-background p-1">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :aria-label="t('app.themeSystem')"
                    :aria-pressed="themeMode === 'system'"
                    :class="themeMode === 'system' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    @click="setTheme('system')"
                  >
                    <Monitor />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ t('app.themeSystem') }}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :aria-label="t('app.themeLight')"
                    :aria-pressed="themeMode === 'light'"
                    :class="themeMode === 'light' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    @click="setTheme('light')"
                  >
                    <Sun />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ t('app.themeLight') }}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :aria-label="t('app.themeDark')"
                    :aria-pressed="themeMode === 'dark'"
                    :class="themeMode === 'dark' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    @click="setTheme('dark')"
                  >
                    <Moon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ t('app.themeDark') }}</TooltipContent>
              </Tooltip>
            </div>

            <div class="flex items-center gap-1 rounded-md border border-input bg-background p-1">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :aria-label="t('app.github')"
                    as="a"
                    href="https://github.com/Blackn-L/Only-Tools-Web"
                    rel="noreferrer"
                    size="icon-sm"
                    target="_blank"
                    variant="ghost"
                  >
                    <svg
                      aria-hidden="true"
                      class="size-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ t('app.github') }}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :aria-label="languageToggleLabel"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    @click="toggleLocale"
                  >
                    <Languages />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ languageToggleLabel }}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </TooltipProvider>
</template>
