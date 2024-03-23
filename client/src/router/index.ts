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
          path: 'sessions',
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
          name: 'Admin Sessions',
          component: () => import('../views/admin/SessionsView.vue'),
        },
        {
          path: 'schedule',
          name: 'Schedule',
          component: () => import('../views/admin/ScheduleView.vue'),
        },
        {
          path: 'trainers',
          name: 'Trainers',
          component: () => import('../views/admin/TrainersView.vue'),
        },
        {
          path: 'classes',
          name: 'Classes',
          component: () => import('../views/admin/ClassesView.vue'),
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
