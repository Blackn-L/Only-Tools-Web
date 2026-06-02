import { createRouter, createWebHistory } from 'vue-router'
import ToolHome from '@/views/ToolHome.vue'
import KeyProbeView from '@/tools/key-probe/KeyProbeView.vue'
import ImageGeneratorView from '@/tools/image-generator/ImageGeneratorView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ToolHome,
    },
    {
      path: '/tools/key-probe',
      name: 'key-probe',
      component: KeyProbeView,
      meta: {
        titleKey: 'keyTester.title',
        descriptionKey: 'keyTester.description',
      },
    },
    {
      path: '/tools/image-generator',
      name: 'image-generator',
      component: ImageGeneratorView,
      meta: {
        titleKey: 'imageGenerator.title',
        descriptionKey: 'imageGenerator.description',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
