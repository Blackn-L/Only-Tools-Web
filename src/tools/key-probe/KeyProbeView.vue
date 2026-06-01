<script setup lang="ts">
import { NAlert } from 'naive-ui'
import AddKeyForm from './components/AddKeyForm.vue'
import ControlBar from './components/ControlBar.vue'
import StatsBar from './components/StatsBar.vue'
import FilterBar from './components/FilterBar.vue'
import KeyTable from './components/KeyTable.vue'
</script>

<template>
  <main class="key-probe">
    <header class="key-probe__header">
      <p class="eyebrow">Internal tool</p>
      <h1>API Key Tester</h1>
      <p>
        Test OpenAI-compatible chat completions endpoints without sending keys to
        any service except the endpoint you configure.
      </p>
    </header>

    <n-alert class="privacy-note" type="info" :bordered="false">
      Keys stay in this browser session by default. Enable local persistence only
      on a trusted device.
    </n-alert>

    <section class="tool-surface">
      <AddKeyForm />
      <ControlBar />
      <StatsBar />
      <FilterBar />
      <KeyTable />
    </section>
  </main>
</template>

<style scoped>
.key-probe {
  max-width: 1180px;
  margin: 0 auto;
}

.key-probe__header {
  padding-bottom: 22px;
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
p {
  margin: 0;
}

h1 {
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.05;
}

.key-probe__header p:last-child {
  max-width: 680px;
  margin-top: 12px;
  color: #626973;
}

.privacy-note {
  margin: 22px 0;
}

.tool-surface {
  padding: 24px;
  border: 1px solid #e3e6ea;
  border-radius: 8px;
  background: #ffffff;
}

@media (max-width: 720px) {
  .tool-surface {
    padding: 16px;
  }
}
</style>
