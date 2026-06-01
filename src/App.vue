<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import AppShell from '@/components/AppShell.vue'
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <AppShell />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  background: #f6f7f9;
  color: #202225;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}
</style>
