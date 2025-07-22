<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { watch, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Topbar from '@/components/layout/Topbar.vue';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.initializeAuth();
});

watch(
  () => router.currentRoute.value,
  (to) => {
    const requiresAuth = to.meta.requiresAuth;
    if (requiresAuth && !authStore.isAuthenticated) {
      router.replace({ name: 'Login' });
    }
    if (to.name === 'Login' && authStore.isAuthenticated) {
      router.replace({ path: '/' });
    }
  },
  { immediate: true }
);

const isAuthRoute = computed(() => {
  const route = router.currentRoute.value;
  return route.name === 'Login' || route.name === 'Register';
});
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Topbar />
    
    <Header v-if="authStore.isAuthenticated" />
    
    <main class="flex-1">
      <div v-if="isAuthRoute" class="flex items-center justify-center p-6">
        <div class="w-full max-w-md">
          <RouterView />
        </div>
      </div>
      
      <div v-else class="p-6 my-24">
        <div class="max-w-7xl mx-auto">
          <RouterView />
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>
