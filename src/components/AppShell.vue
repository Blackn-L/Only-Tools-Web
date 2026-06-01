<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NDrawer,
  NDrawerContent,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NText,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { categories, tools } from '@/config/toolCatalog'
import type { ToolItem } from '@/types/tools'

const route = useRoute()
const router = useRouter()
const showDrawer = ref(false)

const categoryMap = new Map(categories.map((category) => [category.id, category.name]))

function menuKey(tool: ToolItem) {
  return tool.kind === 'internal' ? tool.path : tool.url
}

const menuOptions = computed<MenuOption[]>(() =>
  categories
    .map((category) => {
      const children = tools
        .filter((tool) => tool.categoryId === category.id)
        .map((tool) => ({
          key: menuKey(tool),
          label: `${tool.name}${tool.kind === 'external' ? ' ↗' : ''}`,
        }))

      return {
        key: category.id,
        label: categoryMap.get(category.id) ?? category.name,
        children,
      }
    })
    .filter((option) => option.children.length > 0),
)

const activeKey = computed(() => route.path)

function handleMenuSelect(key: string) {
  const tool = tools.find((item) => menuKey(item) === key)
  if (!tool) return

  showDrawer.value = false
  if (tool.kind === 'internal') {
    router.push(tool.path)
    return
  }
  window.open(tool.url, '_blank', 'noreferrer')
}
</script>

<template>
  <n-layout class="app-shell">
    <n-layout-sider
      class="app-shell__sider"
      :native-scrollbar="false"
      bordered
      collapse-mode="width"
      :width="248"
    >
      <RouterLink class="brand" to="/">
        <span class="brand__mark">O</span>
        <span>
          <strong>Only Tools Web</strong>
          <small>Personal tool navigator</small>
        </span>
      </RouterLink>
      <n-menu
        :value="activeKey"
        :options="menuOptions"
        @update:value="handleMenuSelect"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header class="app-shell__header" bordered>
        <RouterLink class="brand brand--compact" to="/">
          <span class="brand__mark">O</span>
          <strong>Only Tools Web</strong>
        </RouterLink>
        <n-text depth="3" class="app-shell__status">
          {{ tools.length }} tools · local-first
        </n-text>
        <n-button class="app-shell__menu-button" secondary @click="showDrawer = true">
          Menu
        </n-button>
      </n-layout-header>

      <n-layout-content class="app-shell__content">
        <RouterView />
      </n-layout-content>
    </n-layout>

    <n-drawer v-model:show="showDrawer" placement="left" :width="300">
      <n-drawer-content title="Only Tools Web">
        <n-menu
          :value="activeKey"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </n-drawer-content>
    </n-drawer>
  </n-layout>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f6f7f9;
}

.app-shell__sider {
  display: block;
  background: #ffffff;
}

.app-shell__header {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.app-shell__content {
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.app-shell__status {
  margin-left: auto;
  font-size: 13px;
}

.app-shell__menu-button {
  display: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  color: inherit;
  text-decoration: none;
}

.brand--compact {
  display: none;
  padding: 0;
}

.brand__mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid #1f7a5a;
  border-radius: 8px;
  color: #1f7a5a;
  font-weight: 700;
}

.brand small {
  display: block;
  margin-top: 2px;
  color: #757b84;
  font-size: 12px;
}

@media (max-width: 860px) {
  .app-shell__sider {
    display: none;
  }

  .app-shell__content {
    padding: 20px;
  }

  .brand--compact,
  .app-shell__menu-button {
    display: flex;
  }

  .app-shell__status {
    display: none;
  }
}
</style>
