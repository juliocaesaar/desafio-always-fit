import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { refreshToken } from '@/services/authService';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trainings',
    name: 'Trainings',
    component: () => import('@/views/TrainingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/nutrition',
    name: 'Nutrition',
    component: () => import('@/views/NutritionView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/progress',
    name: 'Progress',
    component: () => import('@/views/ProgressView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (refresh_token) {
    try {
      const response = await refreshToken();
      if (response.token) {
        localStorage.setItem('token', response.token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
      }
    } catch (e) {
      const authStore = useAuthStore();
      await authStore.logout();
      return next('/login');
    }
  }
  next();
});

export default router
