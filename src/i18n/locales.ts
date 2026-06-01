export type SupportedLocale = 'zh-CN' | 'en-US'

export type LocalizedText = {
  zhCN: string
  enUS: string
}

export const defaultLocale: SupportedLocale = 'zh-CN'
export const localeStorageKey = 'only-tools-web:locale'

export const localeOptions: { value: SupportedLocale; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
]

export function isSupportedLocale(locale: string | null): locale is SupportedLocale {
  return locale === 'zh-CN' || locale === 'en-US'
}

export function loadSavedLocale(): SupportedLocale {
  if (typeof localStorage === 'undefined') return defaultLocale
  const saved = localStorage.getItem(localeStorageKey)
  return isSupportedLocale(saved) ? saved : defaultLocale
}

export function saveLocale(locale: SupportedLocale) {
  localStorage.setItem(localeStorageKey, locale)
}

export function getLocalizedText(text: LocalizedText, locale: SupportedLocale) {
  return locale === 'zh-CN' ? text.zhCN : text.enUS
}
