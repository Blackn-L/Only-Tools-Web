<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NButton, NLayout, NLayoutContent, NLayoutHeader, NSelect, NText } from 'naive-ui'
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
  <n-layout class="app-shell">
    <n-layout-header class="app-shell__header" bordered>
      <div class="app-shell__left">
        <n-button v-if="!isHome" secondary class="back-button" @click="goHome">
          {{ t('app.back') }}
        </n-button>
        <RouterLink class="brand" to="/">
          <span class="brand__mark">O</span>
          <span>
            <strong>Only Tools Web</strong>
            <small>{{ t('app.subtitle') }}</small>
          </span>
        </RouterLink>
      </div>

      <div class="app-shell__right">
        <n-text depth="3" class="app-shell__status">{{ t('app.localFirst') }}</n-text>
        <n-select
          v-model:value="currentLocale"
          class="locale-select"
          :options="localeOptions"
          size="small"
          :aria-label="t('app.language')"
        />
      </div>
    </n-layout-header>

    <n-layout-content class="app-shell__content">
      <RouterView />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f6f7f9;
}

.app-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  height: 68px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
}

.app-shell__left,
.app-shell__right {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.app-shell__content {
  min-height: calc(100vh - 68px);
  padding: 34px 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
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

.app-shell__status {
  font-size: 13px;
}

.locale-select {
  width: 128px;
}

@media (max-width: 700px) {
  .app-shell__header {
    height: auto;
    min-height: 68px;
    align-items: stretch;
    flex-direction: column;
    padding: 14px 18px;
  }

  .app-shell__left,
  .app-shell__right {
    width: 100%;
    justify-content: space-between;
  }

  .app-shell__content {
    padding: 22px 18px;
  }

  .back-button {
    flex: 0 0 auto;
  }
}
</style>
