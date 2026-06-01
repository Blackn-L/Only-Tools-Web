export function formatMs(ms?: number): string {
  if (ms === undefined) return '—'
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`
}

export function truncateKey(key: string): string {
  if (key.length <= 20) return key
  return key.slice(0, 10) + '...' + key.slice(-7)
}
