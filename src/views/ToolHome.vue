<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NButton, NEmpty, NInput, NTag, NText } from 'naive-ui'
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
  <main class="tool-home">
    <section class="tool-home__intro" aria-labelledby="home-title">
      <p class="eyebrow">{{ t('home.eyebrow') }}</p>
      <div class="intro-row">
        <div>
          <h1 id="home-title">{{ t('home.title') }}</h1>
          <p class="intro-copy">{{ t('home.description') }}</p>
        </div>
        <div class="intro-meta">
          <strong>{{ totalMatches }}</strong>
          <span>{{ t('home.matchCount', { count: totalMatches }) }}</span>
        </div>
      </div>
    </section>

    <section class="tool-home__controls" aria-label="Tool search">
      <n-input
        v-model:value="query"
        clearable
        :placeholder="t('home.search')"
        size="large"
      />
    </section>

    <section class="tool-section" aria-labelledby="all-tools-title">
      <div class="section-heading">
        <h2 id="all-tools-title">{{ t('home.allTools') }}</h2>
        <n-text depth="3">{{ t('home.matchCount', { count: totalMatches }) }}</n-text>
      </div>

      <div v-if="groupedTools.length > 0" class="category-list">
        <section
          v-for="group in groupedTools"
          :key="group.category.id"
          class="category-group"
          :aria-labelledby="`category-${group.category.id}`"
        >
          <header class="category-group__header">
            <div>
              <h3 :id="`category-${group.category.id}`">
                {{ getLocalizedText(group.category.name, currentLocale) }}
              </h3>
              <p>{{ getLocalizedText(group.category.description, currentLocale) }}</p>
            </div>
            <n-tag size="small" :bordered="false">{{ group.tools.length }}</n-tag>
          </header>

          <div class="tool-list">
            <article v-for="tool in group.tools" :key="tool.id" class="tool-row">
              <button class="tool-row__main" type="button" @click="openTool(tool)">
                <span>
                  <strong>{{ label(tool.name) }}</strong>
                  <small>{{ label(tool.description) }}</small>
                </span>
                <n-tag size="small" :bordered="false">
                  {{ tool.kind === 'external' ? t('home.external') : t('home.internal') }}
                </n-tag>
              </button>
              <div class="tag-list">
                <span v-for="tag in tool.tags" :key="tag">#{{ tag }}</span>
              </div>
              <n-button secondary @click="openTool(tool)">
                {{ tool.kind === 'external' ? t('home.open') : t('home.launch') }}
              </n-button>
            </article>
          </div>
        </section>
      </div>

      <n-empty v-else :description="t('home.noTools')" />
    </section>
  </main>
</template>

<style scoped>
.tool-home {
  max-width: 1080px;
  margin: 0 auto;
}

.tool-home__intro {
  padding-bottom: 26px;
  border-bottom: 1px solid #e3e6ea;
}

.intro-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #1f7a5a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: clamp(34px, 5vw, 64px);
  line-height: 1;
}

h2 {
  font-size: 18px;
}

h3 {
  font-size: 16px;
}

.intro-copy {
  max-width: 560px;
  margin-top: 14px;
  color: #626973;
  font-size: 16px;
}

.intro-meta {
  display: grid;
  min-width: 148px;
  gap: 2px;
  padding: 18px 0 4px;
  text-align: right;
}

.intro-meta strong {
  color: #1f7a5a;
  font-size: 42px;
  line-height: 1;
}

.intro-meta span,
.category-group__header p {
  color: #626973;
  font-size: 13px;
}

.tool-home__controls {
  margin: 28px 0 32px;
}

.section-heading,
.category-group__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.section-heading {
  margin-bottom: 18px;
}

.category-list {
  display: grid;
  gap: 30px;
}

.category-group {
  display: grid;
  gap: 12px;
}

.tool-list {
  display: grid;
  border-top: 1px solid #e3e6ea;
}

.tool-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(100px, auto) auto;
  align-items: center;
  gap: 20px;
  min-height: 86px;
  padding: 18px 0;
  border-bottom: 1px solid #e3e6ea;
}

.tool-row__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-align: left;
}

.tool-row strong {
  font-size: 16px;
}

.tool-row small {
  display: block;
  margin-top: 6px;
  color: #626973;
  font-size: 13px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #7a828c;
  font-size: 12px;
}

@media (max-width: 760px) {
  .intro-row,
  .section-heading,
  .category-group__header,
  .tool-row,
  .tool-row__main {
    align-items: stretch;
    flex-direction: column;
  }

  .intro-meta {
    min-width: 0;
    text-align: left;
  }

  .tool-row {
    display: flex;
  }
}
</style>
