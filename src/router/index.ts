import { createRouter, createWebHistory } from 'vue-router'
import type { InternalTool } from '@/types/tools'
import ToolHome from '@/views/ToolHome.vue'
import { tools } from '@/config/toolCatalog'

const componentMap: Record<string, () => Promise<unknown>> = {
  'api-key-tester': () => import('@/tools/key-probe/KeyProbeView.vue'),
  'ai-image-generator': () => import('@/tools/image-generator/ImageGeneratorView.vue'),
}

const internalTools = tools.filter(
  (t): t is InternalTool => t.kind === 'internal' && componentMap[t.id] != null,
)

const toolRoutes = internalTools.map((t) => ({
  path: t.path,
  name: t.id,
  component: componentMap[t.id],
  meta: {
    titleKey: t.titleKey,
    descriptionKey: t.descriptionKey,
  },
}))

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ToolHome,
    },
    ...toolRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
