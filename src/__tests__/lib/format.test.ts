import { describe, it, expect } from 'vitest'
import { formatMs, truncateKey } from '@/lib/format'

describe('formatMs', () => {
  it('returns — for undefined', () => {
    expect(formatMs(undefined)).toBe('—')
  })

  it('formats milliseconds under 1000ms', () => {
    expect(formatMs(0)).toBe('0ms')
    expect(formatMs(123)).toBe('123ms')
    expect(formatMs(999)).toBe('999ms')
  })

  it('rounds to nearest ms', () => {
    expect(formatMs(123.7)).toBe('124ms')
    expect(formatMs(123.4)).toBe('123ms')
  })

  it('formats seconds for >= 1000ms', () => {
    expect(formatMs(1000)).toBe('1.00s')
    expect(formatMs(1234)).toBe('1.23s')
    expect(formatMs(10000)).toBe('10.00s')
  })
})

describe('truncateKey', () => {
  it('returns key as-is when <= 20 chars', () => {
    expect(truncateKey('12345678901234567890')).toBe('12345678901234567890')
    expect(truncateKey('short')).toBe('short')
    expect(truncateKey('')).toBe('')
  })

  it('truncates key longer than 20 chars', () => {
    const key = 'abcdefghijklmnopqrstuvwx' // 24 chars
    const result = truncateKey(key)
    expect(result).toBe('abcdefghij...rstuvwx')
    expect(result.length).toBe(20)
  })

  it('handles exactly 21 char key', () => {
    const key = 'abcdefghijklmnopqrstu' // 21 chars
    expect(truncateKey(key)).toBe('abcdefghij...opqrstu')
  })
})
