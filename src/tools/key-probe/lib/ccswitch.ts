import type { KeyItem } from './types'

export const CCSWITCH_APPS = ['claude', 'codex'] as const
export type CcswitchApp = (typeof CCSWITCH_APPS)[number]

export const CCSWITCH_APP_LABELS: Record<CcswitchApp, string> = {
  claude: 'Claude Code',
  codex: 'Codex',
}

export type CcswitchProvider = {
  name: string
  endpoint: string
  apiKey: string
  model: string
  notes: string
}

// CC Switch deep link V1: ccswitch://v1/import?resource=provider&app=...&name=...&endpoint=...&apiKey=...&model=...
// encodeURIComponent keeps spaces as %20 (not +), which the cc-switch URI parser expects.
function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

export function toCcswitchProvider(item: KeyItem): CcswitchProvider {
  return {
    name: item.note.trim() || item.model.trim() || 'Provider',
    endpoint: item.baseUrl.trim(),
    apiKey: item.key.trim(),
    model: item.model.trim(),
    notes: item.note.trim(),
  }
}

export function buildCcswitchUrl(item: KeyItem, app: CcswitchApp): string {
  const provider = toCcswitchProvider(item)
  const query = encodeQuery({
    resource: 'provider',
    app,
    name: provider.name,
    endpoint: provider.endpoint,
    apiKey: provider.apiKey,
    model: provider.model,
    notes: provider.notes,
  })
  return `ccswitch://v1/import?${query}`
}

export function openCcswitch(item: KeyItem, app: CcswitchApp): void {
  const a = document.createElement('a')
  a.href = buildCcswitchUrl(item, app)
  document.body.appendChild(a)
  a.click()
  a.remove()
}
