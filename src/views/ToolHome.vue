<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NEmpty, NInput, NTag, NText } from 'naive-ui'
import { categories, featuredTools, tools } from '@/config/toolCatalog'
import type { ToolCategoryId, ToolItem } from '@/types/tools'

const router = useRouter()
const query = ref('')
const selectedCategory = ref<ToolCategoryId | 'all'>('all')

const categoryOptions = computed(() => [
  { id: 'all' as const, name: 'All' },
  ...categories.filter((category) => tools.some((tool) => tool.categoryId === category.id)),
])

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredTools = computed(() => {
  return tools.filter((tool) => {
    const matchesCategory =
      selectedCategory.value === 'all' || tool.categoryId === selectedCategory.value
    const haystack = [tool.name, tool.description, ...tool.tags].join(' ').toLowerCase()
    const matchesQuery = !normalizedQuery.value || haystack.includes(normalizedQuery.value)
    return matchesCategory && matchesQuery
  })
})

function openTool(tool: ToolItem) {
  if (tool.kind === 'internal') {
    router.push(tool.path)
    return
  }
  window.open(tool.url, '_blank', 'noreferrer')
}

function categoryName(id: ToolCategoryId) {
  return categories.find((category) => category.id === id)?.name ?? id
}
</script>

<template>
  <main class="tool-home">
    <section class="tool-home__intro" aria-labelledby="home-title">
      <div>
        <p class="eyebrow">Local-first tool directory</p>
        <h1 id="home-title">Only Tools Web</h1>
        <p class="intro-copy">
          Search internal utilities and safe public links from one quiet workspace.
        </p>
      </div>
      <div class="intro-meta">
        <strong>{{ tools.length }}</strong>
        <span>available tools</span>
      </div>
    </section>

    <section class="tool-home__controls" aria-label="Tool filters">
      <n-input
        v-model:value="query"
        clearable
        placeholder="Search by name, tag, or description"
        size="large"
      />
      <div class="category-strip">
        <button
          v-for="category in categoryOptions"
          :key="category.id"
          class="category-button"
          :class="{ 'category-button--active': selectedCategory === category.id }"
          type="button"
          @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </section>

    <section v-if="featuredTools.length > 0" class="tool-section" aria-labelledby="featured-title">
      <div class="section-heading">
        <h2 id="featured-title">Featured</h2>
        <n-text depth="3">Pinned internal tools for repeated use.</n-text>
      </div>
      <div class="tool-list">
        <button
          v-for="tool in featuredTools"
          :key="tool.id"
          class="tool-row tool-row--featured"
          type="button"
          @click="openTool(tool)"
        >
          <span>
            <strong>{{ tool.name }}</strong>
            <small>{{ tool.description }}</small>
          </span>
          <n-tag size="small" :bordered="false">{{ categoryName(tool.categoryId) }}</n-tag>
        </button>
      </div>
    </section>

    <section class="tool-section" aria-labelledby="all-tools-title">
      <div class="section-heading">
        <h2 id="all-tools-title">All Tools</h2>
        <n-text depth="3">{{ filteredTools.length }} matching tools</n-text>
      </div>

      <div v-if="filteredTools.length > 0" class="tool-list">
        <article v-for="tool in filteredTools" :key="tool.id" class="tool-row">
          <div>
            <div class="tool-row__title">
              <strong>{{ tool.name }}</strong>
              <n-tag size="small" :bordered="false">
                {{ tool.kind === 'external' ? 'External' : 'Internal' }}
              </n-tag>
            </div>
            <p>{{ tool.description }}</p>
            <div class="tag-list">
              <span v-for="tag in tool.tags" :key="tag">#{{ tag }}</span>
            </div>
          </div>
          <n-button secondary @click="openTool(tool)">
            {{ tool.kind === 'external' ? 'Open' : 'Launch' }}
          </n-button>
        </article>
      </div>

      <n-empty v-else description="No tools match the current filters." />
    </section>
  </main>
</template>

<style scoped>
.tool-home {
  max-width: 1080px;
  margin: 0 auto;
}

.tool-home__intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e3e6ea;
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

.intro-copy {
  max-width: 540px;
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

.intro-meta span {
  color: #626973;
  font-size: 13px;
}

.tool-home__controls {
  display: grid;
  gap: 14px;
  margin: 28px 0 32px;
}

.category-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-button {
  border: 1px solid #d7dce2;
  border-radius: 999px;
  background: #ffffff;
  color: #39404a;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 7px 12px;
}

.category-button--active {
  border-color: #1f7a5a;
  background: #e9f4ef;
  color: #155940;
}

.tool-section {
  margin-top: 30px;
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.tool-list {
  display: grid;
  border-top: 1px solid #e3e6ea;
}

.tool-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  min-height: 86px;
  padding: 18px 0;
  border: 0;
  border-bottom: 1px solid #e3e6ea;
  background: transparent;
  color: inherit;
  text-align: left;
}

button.tool-row {
  cursor: pointer;
}

.tool-row--featured {
  min-height: 72px;
}

.tool-row strong {
  font-size: 16px;
}

.tool-row small,
.tool-row p {
  display: block;
  margin-top: 6px;
  color: #626973;
  font-size: 13px;
}

.tool-row__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  color: #7a828c;
  font-size: 12px;
}

@media (max-width: 720px) {
  .tool-home__intro,
  .section-heading,
  .tool-row {
    align-items: stretch;
    flex-direction: column;
  }

  .intro-meta {
    min-width: 0;
    text-align: left;
  }
}
</style>
