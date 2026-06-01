import type { ToolCategory, ToolItem } from '@/types/tools'

export const toolCategories: ToolCategory[] = [
  {
    id: 'ai',
    name: { zhCN: 'AI', enUS: 'AI' },
    description: {
      zhCN: 'API 测试和模型工作流工具。',
      enUS: 'API testing and model workflow utilities.',
    },
  },
  {
    id: 'productivity',
    name: { zhCN: '效率', enUS: 'Productivity' },
    description: {
      zhCN: '日常任务和轻量工作流工具。',
      enUS: 'Everyday tools for lightweight workflows.',
    },
  },
  {
    id: 'local',
    name: { zhCN: '本地私有', enUS: 'Local' },
    description: {
      zhCN: '从被 Git 忽略的本地 catalog 加载。',
      enUS: 'Private tools loaded from a gitignored local catalog.',
    },
  },
]

export const publicTools: ToolItem[] = [
  {
    id: 'api-key-tester',
    name: {
      zhCN: 'API Key Tester',
      enUS: 'API Key Tester',
    },
    description: {
      zhCN: '在浏览器中测试 OpenAI-compatible Chat Completions endpoint。',
      enUS: 'Test an OpenAI-compatible chat completions endpoint from your browser.',
    },
    categoryId: 'ai',
    tags: ['api', 'key', 'openai-compatible'],
    kind: 'internal',
    path: '/tools/key-probe',
  },
]
