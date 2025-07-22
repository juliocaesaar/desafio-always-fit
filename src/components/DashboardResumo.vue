<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNutritionPlans } from '../services/nutritionService'
import { getProgressLogs } from '../services/progressService'
import { getTrainings } from '../services/trainingService'

const totalTreinos = ref<number>(0)
const totalRefeicoes = ref<number>(0)
const totalProgresso = ref<number>(0)
const loading = ref<boolean>(true)

const fetchResumo = async () => {
    try {
        loading.value = true
        const treinosResponse = await getTrainings()
        const refeicoesResponse = await getNutritionPlans()
        const progressoResponse = await getProgressLogs()
        if (Array.isArray(treinosResponse)) {
            totalTreinos.value = treinosResponse.length
        } else if (treinosResponse?.data) {
            totalTreinos.value = Array.isArray(treinosResponse.data) ? treinosResponse.data.length : 0
        }
        if (Array.isArray(refeicoesResponse)) {
            totalRefeicoes.value = refeicoesResponse.length
        } else if (refeicoesResponse?.data) {
            totalRefeicoes.value = Array.isArray(refeicoesResponse.data) ? refeicoesResponse.data.length : 0
        }
        if (Array.isArray(progressoResponse)) {
            totalProgresso.value = progressoResponse.length
        } else if (progressoResponse?.data) {
            totalProgresso.value = Array.isArray(progressoResponse.data) ? progressoResponse.data.length : 0
        }
    } catch (error) {
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchResumo()
})
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span v-if="loading" class="text-3xl font-bold text-gray-400">...</span>
            <span v-else class="text-3xl font-bold text-blue-600">{{ totalTreinos }}</span>
            <span class="mt-2 text-gray-600">Treinos</span>
        </div>
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span v-if="loading" class="text-3xl font-bold text-gray-400">...</span>
            <span v-else class="text-3xl font-bold text-green-600">{{ totalRefeicoes }}</span>
            <span class="mt-2 text-gray-600">Refeições</span>
        </div>
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span v-if="loading" class="text-3xl font-bold text-gray-400">...</span>
            <span v-else class="text-3xl font-bold text-purple-600">{{ totalProgresso }}</span>
            <span class="mt-2 text-gray-600">Registros de Progresso</span>
        </div>
    </div>
</template>
