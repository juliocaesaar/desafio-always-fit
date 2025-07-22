<template>
  <header class="header-bg shadow-md">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img src="@/assets/logo.png" alt="AlwaysFit" class="h-7 w-auto" />
        </div>

        <div class="flex-1 flex justify-center gap-4">
          <button v-if="showBackButton" @click="goBack"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeftIcon class="w-5 h-5 text-gray-700" />
          </button>
          <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center">
          <button @click="logout"
            class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowRightOnRectangleIcon class="w-5 h-5 text-gray-700" />
            <span class="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ArrowRightOnRectangleIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const showBackButton = computed(() => {
  return route.path !== '/'
})

const pageTitle = computed(() => {
  const routeTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/trainings': 'Treinos',
    '/nutrition': 'Nutrição',
    '/progress': 'Progresso'
  }
  return routeTitles[route.path] || 'AlwaysFit'
})

const goBack = () => {
  router.push('/')
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header-bg {
  background-color: #F6F6FA;
}
</style>