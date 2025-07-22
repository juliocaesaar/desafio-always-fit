<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/outline'
import type { Nutrition } from '@/types'

interface Props {
  nutrition: Nutrition
}

const props = defineProps<Props>()
const emit = defineEmits<{
  details: [nutrition: Nutrition]
  edit: [nutrition: Nutrition]
  update: [nutrition: Nutrition]
}>()

const handleEdit = () => {
  emit('edit', props.nutrition)
}

const handleDetails = () => {
  emit('details', props.nutrition)
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

const getMealTypeIcon = (mealType: string) => {
  const icons: Record<string, string> = {
    'café': '🍳',
    'lanche_manha': '🍎',
    'almoço': '🥑',
    'lanche_tarde': '🫐',
    'jantar': '🍽️',
    'ceia': '🥛'
  }
  return icons[mealType] || '🍽️'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">{{ getMealTypeIcon(nutrition.meal_type) }}</span>
          <h3 class="text-lg font-semibold text-gray-900">{{ nutrition.name }}</h3>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {{ getMealTypeLabel(nutrition.meal_type) }}
          </span>
        </div>
      </div>
      
      <button 
        @click="handleEdit"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Editar refeição"
      >
        <PencilIcon class="w-4 h-4" />
      </button>
    </div>
    
    <p v-if="nutrition.description" class="text-gray-600 text-sm mb-4">
      {{ nutrition.description }}
    </p>
    
    <button 
      @click="handleDetails"
      class="w-full border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      Detalhes
    </button>
  </div>
</template>