<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-semibold text-gray-700">Seus treinos de hoje</h2>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando treinos...</p>
    </div>

    <div v-else-if="!loading && trainings && trainings.length > 0" class="space-y-8">
      <div v-for="category in getUniqueCategories()" :key="category" class="space-y-4">
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ category }}</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardTreino
            v-for="trainingItem in getTrainingsByCategory(category)"
            :key="trainingItem.id"
            :training="trainingItem"
            :progress="getProgressForTraining(Number(trainingItem.id))"
            @progress-updated="fetchProgresses"
            @update="updateTrainingFromCard"
            @details="showTrainingDetails"
            @edit="editTraining"
            @delete="confirmDeleteTraining"
          />
        </div>
      </div>
    </div>

    <div v-else-if="!loading && (!trainings || trainings.length === 0)" class="text-center py-12">
      <div class="text-gray-500">
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum treino encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro treino.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#153B4E] hover:bg-[#0f2a38]"
          >
            Criar Treino
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button 
        @click="showCreateModal = true"
        class="bg-[#153B4E] hover:bg-[#0f2a38] text-white px-6 py-3 rounded-md transition-colors flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Criar Treino
      </button>
    </div>

    <CreateTrainingModal 
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="fetchTrainingsAndProgress"
    />

    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Editar Treino</h3>
          <button 
            @click="showEditModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="updateTraining">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Treino</label>
              <input 
                v-model="editingTraining.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                v-model="editingTraining.description"
                rows="3"
                style="height: 60px; resize: none;"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nível</label>
              <select
                v-model="editingTraining.level"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediário">Intermediário</option>
                <option value="avançado">Avançado</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select 
                v-model="editingTraining.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Membros superiores">Membros Superiores</option>
                <option value="Membros inferiores">Membros Inferiores</option>
                <option value="Costas">Costas</option>
                <option value="Peito">Peito</option>
                <option value="Ombros">Ombros</option>
                <option value="Bíceps">Bíceps</option>
                <option value="Tríceps">Tríceps</option>
                <option value="Antebraços">Antebraços</option>
                <option value="Quadríceps">Quadríceps</option>
                <option value="Posterior de coxa">Posterior de Coxa</option>
                <option value="Panturrilhas">Panturrilhas</option>
                <option value="Glúteos">Glúteos</option>
                <option value="Abdômen">Abdômen</option>
                <option value="Core">Core</option>
                <option value="Cardio">Cardio</option>
                <option value="Crossfit">Crossfit</option>
                <option value="Pilates">Pilates</option>
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Flexibilidade">Flexibilidade</option>
                <option value="Funcional">Funcional</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
              <input 
                v-model="editingTraining.duration_minutes"
                type="number"
                required
                min="10"
                max="180"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            

          </div>
          
          <div class="flex gap-3 mt-6">
            <button 
              type="button"
              @click="showEditModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="updating"
              class="flex-1 px-4 py-2 bg-[#153B4E] text-white rounded-md hover:bg-[#0f2a38] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ updating ? 'Atualizando...' : 'Atualizar Treino' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Detalhes do Treino</h3>
          <button 
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="selectedTraining" class="space-y-4">
          <div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ selectedTraining.name }}</h4>
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Descrição</h4>
              <p class="text-gray-900">{{ selectedTraining?.description || 'Sem descrição' }}</p>
            </div>
            
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Nível</h4>
              <p class="text-gray-900 capitalize">{{ selectedTraining?.level || 'N/A' }}</p>
            </div>
            
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Categoria</h4>
              <p class="text-gray-900">{{ selectedTraining?.category }}</p>
            </div>
            
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Duração</h4>
              <p class="text-gray-900">{{ selectedTraining?.duration_minutes }} minutos</p>
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              Última edição: {{ selectedTraining?.updated_at ? formatDate(selectedTraining.updated_at) : 'Data não disponível' }}
            </p>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            v-if="selectedTraining"
            @click="confirmDeleteTraining(selectedTraining)"
            class="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
          >
            Deletar
          </button>
          <button 
            v-if="selectedTraining"
            @click="editTraining(selectedTraining)"
            class="flex-1 px-4 py-2 bg-[#153B4E] text-white rounded-md hover:bg-[#0f2a38] transition-colors"
          >
            Editar
          </button>
        </div>
      </div>
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
            <h4 class="text-lg font-medium text-gray-900 mb-2">Deletar treino "{{ trainingToDelete?.name }}"?</h4>
            <p class="text-sm text-gray-600 mb-4">
              Esta ação não pode ser desfeita. O treino será removido permanentemente.
            </p>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-yellow-800">
                <strong>Importante:</strong> Você ainda poderá ver as informações do progresso deste treino na página de progressos.
              </p>
            </div>
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
            @click="deleteTraining"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ deleting ? 'Deletando...' : 'Deletar Treino' }}
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
import { PlusIcon, XMarkIcon, DocumentIcon, PencilIcon, BoltIcon, TrashIcon } from '@heroicons/vue/24/outline'
import CardTreino from '@/components/CardTreino.vue'
import { useAuthStore } from '@/stores/authStore'
import { getTrainings, updateTraining as updateTrainingService, deleteTraining as deleteTrainingService } from '@/services/trainingService'
import { getProgressLogs, incrementProgressLog } from '@/services/progressService'
import type { Training, CreateTraining } from '@/types'
import type { ProgressLog } from '@/types'
import CreateTrainingModal from '@/components/CreateTrainingModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const trainings = ref<Training[]>([])
const loading = ref(false)
const updating = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const selectedTraining = ref<Training | null>(null)
const trainingToDelete = ref<Training | null>(null)
const deleting = ref(false)

const editingTraining = ref<Training>({
  id: 0,
  name: '',
  description: '',
  duration_minutes: 40,
  category: '',
  finished: false,
  total_days: 30,
  user_id: 0,
  created_at: '',
  updated_at: '',
  level: 'iniciante'
})

const trainingCategories = ref([
  { value: 'Membros superiores', label: 'Membros Superiores' },
  { value: 'Membros inferiores', label: 'Membros Inferiores' },
  { value: 'Costas', label: 'Costas' },
  { value: 'Peito', label: 'Peito' },
  { value: 'Ombros', label: 'Ombros' },
  { value: 'Bíceps', label: 'Bíceps' },
  { value: 'Tríceps', label: 'Tríceps' },
  { value: 'Antebraços', label: 'Antebraços' },
  { value: 'Quadríceps', label: 'Quadríceps' },
  { value: 'Posterior de coxa', label: 'Posterior de Coxa' },
  { value: 'Panturrilhas', label: 'Panturrilhas' },
  { value: 'Glúteos', label: 'Glúteos' },
  { value: 'Abdômen', label: 'Abdômen' },
  { value: 'Core', label: 'Core' },
  { value: 'Cardio', label: 'Cardio' },
  { value: 'Crossfit', label: 'Crossfit' },
  { value: 'Pilates', label: 'Pilates' },
  { value: 'Hipertrofia', label: 'Hipertrofia' },
  { value: 'Flexibilidade', label: 'Flexibilidade' },
  { value: 'Funcional', label: 'Funcional' },
])

const progressLogs = ref<ProgressLog[]>([])

const normalizeString = (str: string) => {
  if (!str || typeof str !== 'string') return ''
  return str.trim().toLowerCase()
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Data não disponível'
  return new Date(dateString).toLocaleString('pt-BR')
}

const fetchTrainingsAndProgress = async () => {
  loading.value = true
  try {
    const response = await getTrainings()
    trainings.value = response
    await fetchProgresses()
  } catch (error: any) {
    toast.error('Erro ao carregar treinos ou progresso. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const showTrainingDetails = (training: Training) => {
  selectedTraining.value = training
  showDetailsModal.value = true
}

const editTraining = (training: Training) => {
  editingTraining.value = { ...training }
  showEditModal.value = true
  showDetailsModal.value = false
}

const updateTraining = async () => {
  updating.value = true
  try {
    const response = await updateTrainingService(String(editingTraining.value.id), editingTraining.value)
    toast.success(response.message || 'Treino atualizado com sucesso!')
    showEditModal.value = false
    await fetchTrainingsAndProgress()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao atualizar treino. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    updating.value = false
  }
}

const toggleTrainingCompletion = async (training: Training) => {
  try {
    const updatedTraining = { ...training, finished: !training.finished }
    const response = await updateTrainingService(String(training.id), updatedTraining)
    toast.success(response.message || 'Status do treino atualizado com sucesso!')
    await fetchTrainingsAndProgress()
  } catch (error: any) {
    toast.error('Erro ao atualizar treino')
  }
}

const updateTrainingFromCard = async (updatedTraining: Training) => {
  try {
    const response = await updateTrainingService(String(updatedTraining.id), updatedTraining)
    toast.success(response.message || 'Status do treino atualizado com sucesso!')
    await fetchTrainingsAndProgress()
  } catch (error: any) {
    toast.error('Erro ao atualizar treino')
  }
}

const confirmDeleteTraining = (training: Training) => {
  trainingToDelete.value = training
  showDeleteModal.value = true
}

const deleteTraining = async () => {
  deleting.value = true
  try {
    const response = await deleteTrainingService(trainingToDelete.value?.id || 0)
    toast.success(response.message || 'Treino deletado com sucesso!')
    showDeleteModal.value = false
    trainingToDelete.value = null
    await fetchTrainingsAndProgress()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao deletar treino. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    deleting.value = false
  }
}

const getUniqueCategories = () => {
  const categories = new Set<string>()
  trainings.value.forEach(training => {
    if (training.category) {
      categories.add(training.category)
    }
  })
  return Array.from(categories).sort()
}

const getTrainingsByCategory = (category: string) => {
  return trainings.value.filter(training => training.category === category)
}

const fetchProgresses = async () => {
  try {
    progressLogs.value = await getProgressLogs()
  } catch (error: any) {
    toast.error('Erro ao carregar progresso dos treinos.')
  }
}

const getProgressForTraining = (trainingId: number) => {
  return progressLogs.value.find(p => p.training_id === trainingId) || null
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  fetchTrainingsAndProgress()
})
</script> 