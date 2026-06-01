import type { ToolCategory, ToolItem } from '@/types/tools'

export const toolCategories: ToolCategory[] = [
  {
    id: 'ai',
    name: 'AI',
    description: 'API testing and model workflow utilities.',
  },
  {
    id: 'dev',
    name: 'Development',
    description: 'Documentation and engineering reference tools.',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Everyday tools that keep small tasks close.',
  },
  {
    id: 'local',
    name: 'Local',
    description: 'Private tools loaded from a gitignored local catalog.',
  },
]

export const publicTools: ToolItem[] = [
  {
    id: 'api-key-tester',
    name: 'API Key Tester',
    description: 'Test an OpenAI-compatible chat completions endpoint from your browser.',
    categoryId: 'ai',
    tags: ['api', 'key', 'openai-compatible'],
    kind: 'internal',
    path: '/tools/key-probe',
    featured: true,
  },
  {
    id: 'mdn-web-docs',
    name: 'MDN Web Docs',
    description: 'Reference for web platform APIs, CSS, HTML, and JavaScript.',
    categoryId: 'dev',
    tags: ['docs', 'web', 'reference'],
    kind: 'external',
    url: 'https://developer.mozilla.org/',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Browse code, issues, pull requests, and open-source projects.',
    categoryId: 'dev',
    tags: ['code', 'git', 'opensource'],
    kind: 'external',
    url: 'https://github.com/',
  },
]
