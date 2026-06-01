import type { ToolItem } from '@/types/tools'

export const localTools: ToolItem[] = [
  {
    id: 'my-private-tool',
    name: 'My Private Tool',
    description: 'Replace this example with a local-only tool before copying the file.',
    categoryId: 'local',
    tags: ['local'],
    kind: 'external',
    url: 'https://example.com/',
    enabled: false,
  },
]
