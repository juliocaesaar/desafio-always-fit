<template>
  <div class="space-y-6">
    <div class="text-center mb-6">
      <h2 class="text-xl font-semibold text-gray-600 mb-2">Progresso dos seus treinos</h2>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <p class="text-sm text-gray-800 leading-relaxed">
        A chave para a evolução está na <strong>consistência</strong>! Mantenha sua rotina, aumente a carga <strong>progressivamente</strong> e respeite os dias de <strong>descanso</strong> para melhores resultados.
      </p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <span class="text-gray-500">Carregando progresso...</span>
    </div>

    <div v-else-if="!loading && (!progressLogs || progressLogs.length === 0)" class="text-center py-12">
      <div class="text-gray-500">
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum progresso encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro treino para acompanhar seu progresso.</p>
        <div class="mt-6">
          <button
            @click="goToTrainings"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#153B4E] hover:bg-[#0f2a38]"
          >
            Criar Treino
          </button>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardProgresso
        v-for="progress in progressLogs"
        :key="progress.id"
        :progress="progress"
        @updated="fetchProgressLogs"
        @delete="confirmDeleteProgress"
      />
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
          <button 
            @click="showDeleteModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="text-center">
            <TrashIcon class="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h4 class="text-lg font-medium text-gray-900 mb-2">Deletar progresso do treino "{{ progressToDelete?.training?.name }}"?</h4>
            <p class="text-sm text-gray-600 mb-4">
              Esta ação não pode ser desfeita. O progresso será removido permanentemente.
            </p>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="deleteProgress"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ deleting ? 'Deletando...' : 'Deletar Progresso' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getProgressLogs, deleteProgressLog } from '@/services/progressService'
import type { ProgressLog } from '@/types'

const router = useRouter()
const toast = useToast()
const progressLogs = ref<ProgressLog[]>([])
const loading = ref(false)
const showDeleteModal = ref(false)
const progressToDelete = ref<ProgressLog | null>(null)
const deleting = ref(false)

const fetchProgressLogs = async () => {
  loading.value = true
  try {
    progressLogs.value = await getProgressLogs()
  } finally {
    loading.value = false
  }
}

const goToTrainings = () => {
  router.push('/trainings')
}

const confirmDeleteProgress = (progress: ProgressLog) => {
  progressToDelete.value = progress
  showDeleteModal.value = true
}

const deleteProgress = async () => {
  deleting.value = true
  try {
    const response = await deleteProgressLog(progressToDelete.value?.id || 0)
    toast.success(response.message || 'Progresso deletado com sucesso!')
    showDeleteModal.value = false
    progressToDelete.value = null
    await fetchProgressLogs()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao deletar progresso. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    deleting.value = false
  }
}

onMounted(fetchProgressLogs)
</script> 