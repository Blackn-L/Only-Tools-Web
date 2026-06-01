import { createRouter, createWebHistory } from 'vue-router'
import ToolHome from '@/views/ToolHome.vue'
import KeyProbeView from '@/tools/key-probe/KeyProbeView.vue'

export const router = createRouter({
  history: createWebHistory(),
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
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
