export type ToolKind = 'internal' | 'external'

export type ToolCategoryId = 'ai' | 'dev' | 'productivity' | 'local'

export type ToolCategory = {
  id: ToolCategoryId
  name: string
  description: string
}

type ToolBase = {
  id: string
  name: string
  description: string
  categoryId: ToolCategoryId
  tags: string[]
  featured?: boolean
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
