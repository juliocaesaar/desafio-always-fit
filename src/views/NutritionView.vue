<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-6">
      <div class="text-center flex-1">
        <h2 class="text-xl font-semibold text-gray-600 mb-2">Refeições do dia</h2>
      </div>
      
      <button 
        @click="showCreateModal = true"
        class="lg:hidden bg-[#153B4E] hover:bg-[#0f2a38] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Nova Refeição
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div v-for="mealType in mealTypes" :key="mealType.value" class="border border-gray-200 rounded-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">{{ getMealTypeIcon(mealType.value) }}</span>
            <h3 class="text-lg font-semibold text-gray-900">{{ mealType.label }}</h3>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="nutrition in getMealsByType(mealType.value)" 
              :key="nutrition.id"
              class="py-2"
            >
              <div class="flex justify-between items-start mb-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-gray-900">{{ nutrition.name }}</h4>
                </div>
                <div class="flex items-center gap-1">
                  <button 
                    @click="editNutrition(nutrition)"
                    class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Editar refeição"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="confirmDeleteNutrition(nutrition)"
                    class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Remover refeição"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p v-if="nutrition.description" class="text-sm text-gray-600 ml-4">
                • {{ nutrition.description }}
              </p>
            </div>
            
            <div v-if="getMealsByType(mealType.value).length === 0" class="text-center py-6 text-gray-500">
              <p class="text-sm">Nenhuma refeição cadastrada para {{ mealType.label.toLowerCase() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-lg p-6 bg-blue-light">
          <p class="text-sm text-gray-800 leading-relaxed">
            Tente fazer da sua refeição um momento de <strong>pausa</strong> e <strong>presença</strong>. 
            Coma devagar, apreciando cada sabor — isso <strong>faz bem</strong> para o corpo e para a mente.
          </p>
        </div>

        <div class="rounded-lg p-6 bg-yellow-light">
          <p class="text-sm text-gray-700 leading-relaxed">
            Em meio à correria do dia a dia, fazer uma pausa para se alimentar é um dos gestos mais simples — 
            e poderosos — de cuidado consigo mesmo. Mais do que apenas ingerir alimentos, a refeição é um ritual 
            de conexão: com seu corpo, seus sentidos e o momento presente.
          </p>
          <p class="text-sm text-gray-700 leading-relaxed mt-3">
            Reserve alguns minutos para se desligar das preocupações e focar no agora. Sente-se confortavelmente, 
            respire fundo e observe seu prato: as cores, os aromas, as texturas. Coma devagar, apreciando cada 
            garfada como uma pequena celebração da vida.
          </p>
        </div>

        <div class="hidden lg:block">
          <button 
            @click="showCreateModal = true"
            class="w-full bg-[#153B4E] hover:bg-[#0f2a38] text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Nova Refeição
          </button>
        </div>
      </div>
    </div>

    <div v-if="nutritionPlans.length === 0 && !loading" class="text-center py-12">
      <div class="text-gray-500">
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma refeição encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">Comece criando sua primeira refeição.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#153B4E] hover:bg-[#0f2a38]"
          >
            Criar Refeição
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando refeições...</p>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Criar Nova Refeição</h3>
          <button 
            @click="showCreateModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="createNutrition">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Refeição</label>
              <input 
                v-model="newNutrition.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Omelete Proteico"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                v-model="newNutrition.description"
                rows="3"
                style="height: 60px; resize: none;"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva os ingredientes..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Refeição</label>
              <select 
                v-model="newNutrition.meal_type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o tipo</option>
                <option value="café">Café da Manhã</option>
                <option value="lanche_manha">Lanche da Manhã</option>
                <option value="almoço">Almoço</option>
                <option value="lanche_tarde">Lanche da Tarde</option>
                <option value="jantar">Jantar</option>
                <option value="ceia">Ceia</option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="creating"
              class="flex-1 px-4 py-2 bg-[#153B4E] text-white rounded-md hover:bg-[#0f2a38] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ creating ? 'Criando...' : 'Criar Refeição' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Editar Refeição</h3>
          <button 
            @click="showEditModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="updateNutrition">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Refeição</label>
              <input 
                v-model="editingNutrition.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Omelete Proteico"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                v-model="editingNutrition.description"
                rows="3"
                style="height: 60px; resize: none;"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva os ingredientes..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Refeição</label>
              <select 
                v-model="editingNutrition.meal_type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o tipo</option>
                <option value="café">Café da Manhã</option>
                <option value="lanche_manha">Lanche da Manhã</option>
                <option value="almoço">Almoço</option>
                <option value="lanche_tarde">Lanche da Tarde</option>
                <option value="jantar">Jantar</option>
                <option value="ceia">Ceia</option>
              </select>
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
              {{ updating ? 'Atualizando...' : 'Atualizar Refeição' }}
            </button>
          </div>
        </form>
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
            <h4 class="text-lg font-medium text-gray-900 mb-2">Deletar refeição "{{ nutritionToDelete?.name }}"?</h4>
            <p class="text-sm text-gray-600 mb-4">
              Esta ação não pode ser desfeita. A refeição será removida permanentemente.
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
            @click="deleteNutrition"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ deleting ? 'Deletando...' : 'Deletar Refeição' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Detalhes da Refeição</h3>
          <button 
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="selectedNutrition" class="space-y-4">
          <div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ selectedNutrition.name }}</h4>
            <p v-if="selectedNutrition.description" class="text-gray-600 mb-4">
              {{ selectedNutrition.description }}
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Tipo de Refeição</span>
              <p class="text-gray-900">{{ getMealTypeLabel(selectedNutrition.meal_type) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Calorias</span>
              <p class="text-gray-900">~350 kcal</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Proteínas</span>
              <p class="text-gray-900">25g</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Carboidratos</span>
              <p class="text-gray-900">45g</p>
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              Última edição: {{ selectedNutrition?.updated_at ? formatDate(selectedNutrition.updated_at) : 'Data não disponível' }}
            </p>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showDetailsModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button 
            v-if="selectedNutrition"
            @click="editNutrition(selectedNutrition)"
            class="flex-1 px-4 py-2 bg-[#153B4E] text-white rounded-md hover:bg-[#0f2a38] transition-colors"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { PlusIcon, XMarkIcon, DocumentIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore'
import { getNutritionPlans, createNutritionPlan, updateNutritionPlan, deleteNutritionPlan } from '@/services/nutritionService'
import type { Nutrition, CreateNutrition } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const nutritionPlans = ref<Nutrition[]>([])
const loading = ref(false)
const creating = ref(false)
const updating = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const selectedNutrition = ref<Nutrition | null>(null)
const nutritionToDelete = ref<Nutrition | null>(null)
const deleting = ref(false)

const newNutrition = ref<CreateNutrition>({
  name: '',
  description: '',
  meal_type: ''
})

const editingNutrition = ref<Nutrition>({
  id: '',
  user_id: '',
  name: '',
  description: '',
  meal_type: '',
  created_at: '',
  updated_at: ''
})

const mealTypes = [
  { value: 'café', label: 'Café da Manhã' },
  { value: 'lanche_manha', label: 'Lanche da Manhã' },
  { value: 'almoço', label: 'Almoço' },
  { value: 'lanche_tarde', label: 'Lanche da Tarde' },
  { value: 'jantar', label: 'Jantar' },
  { value: 'ceia', label: 'Ceia (Opcional)' }
]

const getMealTypeIcon = (mealType: string) => {
  const icons: Record<string, string> = {
    'café': '🥞',
    'lanche_manha': '🍏',
    'almoço': '🍗',
    'lanche_tarde': '🍇',
    'jantar': '🍽️',
    'ceia': '🥛'
  }
  return icons[mealType] || '🍽️'
}

const getMealTypeLabel = (mealType: string) => {
  const labels: Record<string, string> = {
    'café': 'Café da Manhã',
    'lanche_manha': 'Lanche da Manhã',
    'almoço': 'Almoço',
    'lanche_tarde': 'Lanche da Tarde',
    'jantar': 'Jantar',
    'ceia': 'Ceia'
  }
  return labels[mealType] || mealType
}

const getMealsByType = (mealType: string) => {
  return nutritionPlans.value.filter(meal => meal.meal_type === mealType)
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Data não disponível'
  return new Date(dateString).toLocaleString('pt-BR')
}

const fetchNutritionPlans = async () => {
  loading.value = true
  try {
    const response = await getNutritionPlans()
    nutritionPlans.value = response
  } catch (error: any) {
    toast.error('Erro ao carregar refeições. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const createNutrition = async () => {
  creating.value = true
  try {
    const response = await createNutritionPlan(newNutrition.value)
    toast.success(response.message || 'Refeição criada com sucesso!')
    newNutrition.value = {
      name: '',
      description: '',
      meal_type: ''
    }
    showCreateModal.value = false
    await fetchNutritionPlans()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao criar refeição. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    creating.value = false
  }
}

const showNutritionDetails = (nutrition: Nutrition) => {
  selectedNutrition.value = nutrition
  showDetailsModal.value = true
}

const editNutrition = (nutrition: Nutrition) => {
  editingNutrition.value = { ...nutrition }
  showEditModal.value = true
  showDetailsModal.value = false
}

const updateNutrition = async () => {
  updating.value = true
  try {
    const response = await updateNutritionPlan(String(editingNutrition.value.id), editingNutrition.value)
    toast.success(response.message || 'Refeição atualizada com sucesso!')
    showEditModal.value = false
    await fetchNutritionPlans()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao atualizar refeição. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    updating.value = false
  }
}

const confirmDeleteNutrition = (nutrition: Nutrition) => {
  nutritionToDelete.value = nutrition
  showDeleteModal.value = true
}

const deleteNutrition = async () => {
  deleting.value = true
  try {
    const response = await deleteNutritionPlan(String(nutritionToDelete.value?.id || ''))
    toast.success(response.message || 'Refeição deletada com sucesso!')
    showDeleteModal.value = false
    nutritionToDelete.value = null
    await fetchNutritionPlans()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao deletar refeição. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchNutritionPlans()
})
</script> 