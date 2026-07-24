import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import AuthService from '@/services/AuthService'
import { useUserStore } from '@/stores/user'
import { ROLES } from '@/config'

/** Rotte raggiungibili senza sessione. */
const PUBLIC_PATHS = ['/auth/login', '/auth/access', '/auth/error', '/notfound']

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // Tutto cio' che sta dentro AppLayout ha topbar + sidebar + footer
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/pages/dashboard/Dashboard.vue'),
        },
        {
          path: 'items',
          name: 'items',
          component: () => import('@/views/pages/items/Items.vue'),
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('@/views/pages/admin/AdminPanel.vue'),
          meta: { roles: [ROLES.ADMIN] },
        },
        {
          path: 'empty',
          name: 'empty',
          component: () => import('@/views/pages/Empty.vue'),
        },
      ],
    },
    { path: '/auth/login', name: 'login', component: () => import('@/views/pages/auth/Login.vue') },
    { path: '/auth/access', name: 'accessDenied', component: () => import('@/views/pages/auth/Access.vue') },
    { path: '/auth/error', name: 'error', component: () => import('@/views/pages/auth/Error.vue') },
    { path: '/notfound', name: 'notfound', component: () => import('@/views/pages/auth/NotFound.vue') },
    { path: '/:catchAll(.*)*', redirect: '/notfound' },
  ],
})

/**
 * Guard unica dell'app:
 * 1. le rotte pubbliche passano sempre
 * 2. senza sessione -> /auth/login
 * 3. profilo caricato una volta sola e messo nello store
 * 4. `meta.roles` filtra per ruolo -> /auth/access
 */
router.beforeEach(async (to) => {
  if (PUBLIC_PATHS.includes(to.path)) return true

  const userStore = useUserStore()
  const session = await AuthService.waitForAuth()

  if (!session) {
    userStore.clearUser()
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }

  if (!userStore.user) {
    try {
      userStore.setUser(await AuthService.fetchProfile())
    } catch {
      userStore.clearUser()
      return '/auth/login'
    }
  }

  if (!userStore.hasRole(to.meta.roles)) {
    return '/auth/access'
  }

  return true
})

export default router
