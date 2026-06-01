import type { LocalizedText } from '@/i18n/locales'

export type ToolKind = 'internal' | 'external'

export type ToolCategoryId = 'ai' | 'productivity' | 'local'

export type ToolCategory = {
  id: ToolCategoryId
  name: LocalizedText
  description: LocalizedText
}

type ToolBase = {
  id: string
  name: LocalizedText
  description: LocalizedText
  categoryId: ToolCategoryId
  tags: string[]
  enabled?: boolean
}

export type InternalTool = ToolBase & {
  kind: 'internal'
  path: string
}

export type ExternalTool = ToolBase & {
  kind: 'external'
  url: string
}

export type ToolItem = InternalTool | ExternalTool
