import { createI18n } from 'vue-i18n'
import { loadSavedLocale } from './locales'
import { messages } from './messages'

export const i18n = createI18n({
  legacy: false,
  locale: loadSavedLocale(),
  fallbackLocale: 'zh-CN',
  messages,
})
