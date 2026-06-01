<script setup lang="ts">
import { NConfigProvider, darkTheme, NLayout, NLayoutContent, NMessageProvider, NText } from 'naive-ui'
import AddKeyForm from './components/AddKeyForm.vue'
import ControlBar from './components/ControlBar.vue'
import StatsBar from './components/StatsBar.vue'
import FilterBar from './components/FilterBar.vue'
import KeyTable from './components/KeyTable.vue'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <n-layout style="min-height: 100vh; background: var(--n-color)">
        <n-layout-content style="max-width: 1000px; margin: 0 auto; padding: 32px 24px">
          <n-text strong style="font-size: 18px; display: block; margin-bottom: 24px">
            Key Probe Tool
            <n-text depth="3" style="font-size: 13px; font-weight: normal; margin-left: 8px">
              （Mimo Token Plan Key 检测工具）
            </n-text>
          </n-text>
          <AddKeyForm />
          <ControlBar />
          <StatsBar />
          <FilterBar />
          <KeyTable />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
</style>
