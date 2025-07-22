<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Criar Novo Treino</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Treino</label>
            <input 
              v-model="trainingData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: Superior"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              v-model="trainingData.description"
              rows="3"
              style="height: 60px; resize: none;"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Descreva o treino..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nível</label>
            <select
              v-model="trainingData.level"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione o nível</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediário">Intermediário</option>
              <option value="avançado">Avançado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              v-model="trainingData.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione a categoria</option>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Meta de Dias</label>
            <input 
              v-model.number="trainingData.total_days"
              type="number"
              required
              min="1"
              max="365"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="30"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button 
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="creating"
            class="flex-1 px-4 py-2 bg-[#153B4E] text-white rounded-md hover:bg-[#0f2a38] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ creating ? 'Criando...' : 'Criar Treino' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { createTraining } from '@/services/trainingService'
import { useToast } from 'vue-toastification'
import type { CreateTraining } from '@/types'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'created'])

const toast = useToast()
const creating = ref(false)

const trainingData = ref<CreateTraining>({
  name: '',
  description: '',
  level: 'iniciante',
  duration_minutes: 40,
  category: 'Cardio',
  finished: false,
  total_days: 30
})

watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

const resetForm = () => {
  trainingData.value = {
    name: '',
    description: '',
    level: 'iniciante',
    duration_minutes: 40,
    category: 'Cardio',
    finished: false,
    total_days: 30
  }
}

const handleSubmit = async () => {
  creating.value = true
  try {
    trainingData.value.finished = false
    const response = await createTraining(trainingData.value)
    toast.success(response.message || 'Treino criado com sucesso!')
    resetForm()
    emit('close')
    emit('created')
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao criar treino. Tente novamente.'
    toast.error(errorMessage)
  } finally {
    creating.value = false
  }
}
</script> 