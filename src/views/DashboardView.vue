<template>
  <div class="space-y-10">
    <div class="mb-2">
      <span class="text-gray-700 text-sm">Olá <b>{{ userName }}</b>! Seja bem-vindo!</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div 
        @click="navigateToTrainings"
        class="bg-[#183642] rounded-lg shadow-lg flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer"
      >
        <img src="@/assets/treinos.png" alt="Treinos" class="rounded-md w-full h-40 object-cover mb-4" />
        <div class="text-white font-semibold text-base mb-1">Treinos</div>
      </div>
      <div 
        @click="navigateToNutrition"
        class="bg-[#183642] rounded-lg shadow-lg flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer"
      >
        <img src="@/assets/plano nutricional.png" alt="Plano Nutricional" class="rounded-md w-full h-40 object-cover mb-4" />
        <div class="text-white font-semibold text-base mb-1">Plano nutricional</div>
      </div>
      <div 
        @click="navigateToProgress"
        class="bg-[#183642] rounded-lg shadow-lg flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer"
      >
        <img src="@/assets/progresso.png" alt="Progresso" class="rounded-md w-full h-40 object-cover mb-4" />
        <div class="text-white font-semibold text-base mb-1">Progresso</div>
      </div>
    </div>
    
    <div class="border-t my-8"></div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg shadow-xl p-6 flex flex-col items-start">
        <span class="text-gray-500 text-sm mb-2">Treinos disponíveis</span>
        <span class="text-3xl font-bold text-[#183642]">{{ statistics?.trainings_count || 0 }}</span>
      </div>
      <div class="bg-white rounded-lg shadow-xl p-6 flex flex-col items-start">
        <span class="text-gray-500 text-sm mb-2">Planos nutricionais</span>
        <span class="text-3xl font-bold text-[#183642]">{{ statistics?.nutrition_plans_count || 0 }}</span>
      </div>
      <div class="bg-white rounded-lg shadow-xl p-6 flex flex-col items-start">
        <span class="text-gray-500 text-sm mb-2">Logs de progresso</span>
        <span class="text-3xl font-bold text-[#183642]">{{ statistics?.progress_logs_count || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatisticsStore } from '@/stores/statisticsStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const statisticsStore = useStatisticsStore()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || 'Usuário')

const statistics = computed(() => statisticsStore.statistics)

const navigateToTrainings = () => {
  router.push('/trainings')
}

const navigateToNutrition = () => {
  router.push('/nutrition')
}

const navigateToProgress = () => {
  router.push('/progress')
}

onMounted(async () => {
  await statisticsStore.fetchStatistics()
})
</script> 