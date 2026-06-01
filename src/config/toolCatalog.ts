import type { ToolItem } from '@/types/tools'
import { publicTools, toolCategories } from './toolCatalog.public'

const localCatalogModules = import.meta.glob<{ localTools?: ToolItem[] }>('./toolCatalog.local.ts', {
  eager: true,
})

const localTools = Object.values(localCatalogModules).flatMap((module) => module.localTools ?? [])

function isEnabled(tool: ToolItem) {
  return tool.enabled !== false
}

export const categories = toolCategories
export const tools = [...publicTools, ...localTools].filter(isEnabled)
export const featuredTools = tools.filter((tool) => tool.featured)
export const internalTools = tools.filter((tool) => tool.kind === 'internal')
export const externalTools = tools.filter((tool) => tool.kind === 'external')
