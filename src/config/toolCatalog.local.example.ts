import type { ToolItem } from '@/types/tools'

export const localTools: ToolItem[] = [
  {
    id: 'my-private-tool',
    name: {
      zhCN: '我的私有工具',
      enUS: 'My Private Tool',
    },
    description: {
      zhCN: '复制文件后替换为只在本机使用的工具。',
      enUS: 'Replace this example with a local-only tool before copying the file.',
    },
    categoryId: 'local',
    tags: ['local'],
    kind: 'external',
    url: 'https://example.com/',
    enabled: false,
  },
]
