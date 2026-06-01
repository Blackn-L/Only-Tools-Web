<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowRight, ExternalLink, Search } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categories, tools } from '@/config/toolCatalog'
import { getLocalizedText } from '@/i18n/locales'
import type { SupportedLocale } from '@/i18n/locales'
import type { ToolItem } from '@/types/tools'

const router = useRouter()
const { t, locale } = useI18n()
const query = ref('')

const currentLocale = computed(() => locale.value as SupportedLocale)
const normalizedQuery = computed(() => query.value.trim().toLowerCase())

function label(text: ToolItem['name']) {
  return getLocalizedText(text, currentLocale.value)
}

function matchesQuery(tool: ToolItem) {
  if (!normalizedQuery.value) return true
  const haystack = [
    label(tool.name),
    label(tool.description),
    ...tool.tags,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(normalizedQuery.value)
}

const groupedTools = computed(() =>
  categories
    .map((category) => ({
      category,
      tools: tools.filter((tool) => tool.categoryId === category.id && matchesQuery(tool)),
    }))
    .filter((group) => group.tools.length > 0),
)

const totalMatches = computed(() =>
  groupedTools.value.reduce((sum, group) => sum + group.tools.length, 0),
)

function openTool(tool: ToolItem) {
  if (tool.kind === 'internal') {
    router.push(tool.path)
    return
  }
  window.open(tool.url, '_blank', 'noreferrer')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <section class="border-b pb-7" aria-labelledby="home-title">
      <p class="mb-3 text-xs font-semibold uppercase text-primary">{{ t('home.eyebrow') }}</p>
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          <h1 id="home-title" class="text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
            {{ t('home.title') }}
          </h1>
          <p class="mt-4 max-w-2xl text-base text-muted-foreground">
            {{ t('home.description') }}
          </p>
        </div>
        <div class="min-w-32 text-left sm:text-right">
          <strong class="block text-4xl font-semibold leading-none text-primary">
            {{ totalMatches }}
          </strong>
          <span class="mt-1 block text-sm text-muted-foreground">
            {{ t('home.matchCount', { count: totalMatches }) }}
          </span>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-3" :aria-label="t('home.search')">
      <div class="relative max-w-xl">
        <Search class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="query"
          class="h-11 pl-10"
          :placeholder="t('home.search')"
          type="search"
        />
      </div>
    </section>

    <section class="flex flex-col gap-6" aria-labelledby="all-tools-title">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="all-tools-title" class="text-xl font-semibold">{{ t('home.allTools') }}</h2>
        <span class="text-sm text-muted-foreground">{{ t('home.matchCount', { count: totalMatches }) }}</span>
      </div>

      <div v-if="groupedTools.length > 0" class="flex flex-col gap-8">
        <section
          v-for="group in groupedTools"
          :key="group.category.id"
          class="flex flex-col gap-3"
          :aria-labelledby="`category-${group.category.id}`"
        >
          <header class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 :id="`category-${group.category.id}`" class="text-base font-semibold">
                {{ getLocalizedText(group.category.name, currentLocale) }}
              </h3>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ getLocalizedText(group.category.description, currentLocale) }}
              </p>
            </div>
            <Badge variant="secondary">{{ group.tools.length }}</Badge>
          </header>

          <div class="divide-y rounded-md border bg-card">
            <article
              v-for="tool in group.tools"
              :key="tool.id"
              class="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <button
                class="flex min-w-0 flex-col gap-2 text-left"
                type="button"
                @click="openTool(tool)"
              >
                <span class="flex flex-wrap items-center gap-2">
                  <strong class="text-base font-semibold">{{ label(tool.name) }}</strong>
                  <Badge variant="outline">
                    {{ tool.kind === 'external' ? t('home.external') : t('home.internal') }}
                  </Badge>
                </span>
                <span class="text-sm text-muted-foreground">{{ label(tool.description) }}</span>
                <span class="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span v-for="tag in tool.tags" :key="tag">#{{ tag }}</span>
                </span>
              </button>
              <Button variant="outline" size="sm" @click="openTool(tool)">
                <span>{{ tool.kind === 'external' ? t('home.open') : t('home.launch') }}</span>
                <ExternalLink v-if="tool.kind === 'external'" data-icon="inline-end" />
                <ArrowRight v-else data-icon="inline-end" />
              </Button>
            </article>
          </div>
        </section>
      </div>

      <div v-else class="rounded-md border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
        {{ t('home.noTools') }}
      </div>
    </section>
  </div>
</template>
