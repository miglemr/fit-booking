import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user',
      component: UserLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Bookings',
          component: () => import('../views/user/BookingsView.vue'),
        },
        {
          path: '/sessions',
          name: 'Sessions',
          component: () => import('../views/user/SessionsView.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdminAuth: true },
      children: [
        {
          path: '',
          name: 'Panel',
          component: () => import('../views/admin/PanelView.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'Home',
      meta: { requiresAuth: false },
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      meta: { requiresAuth: false },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      meta: { requiresAuth: false },
      component: () => import('../views/SignupView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const store = useUserStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
  if (to.meta.requiresAdminAuth && !store.isAdmin) return '/user'
  if (!to.meta.requiresAuth && store.isLoggedIn) return '/user'
  if (!to.meta.requiresAdminAuth && store.isAdmin) return '/admin'
})

export default router
