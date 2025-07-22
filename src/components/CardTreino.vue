<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Training, ProgressLog } from '@/types'
import { computed } from 'vue'
import { incrementProgressLog } from '@/services/progressService'
import { useToast } from 'vue-toastification'

interface Props {
  training: Training
  progress?: ProgressLog | null
}

const props = defineProps<Props>()
const emit = defineEmits(['edit', 'details', 'progress-updated', 'delete'])
const toast = useToast()

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

const getCategoryImage = (category: string | undefined) => {
  if (!category) return '/src/assets/cardio.webp'
  const categoryImages: { [key: string]: string } = {
    'Membros superiores': '/src/assets/membros-superiores.webp',
    'Membros inferiores': '/src/assets/membros-inferiores.webp',
    'Costas': '/src/assets/costas.jpg',
    'Peito': '/src/assets/peito.jpg',
    'Ombros': '/src/assets/ombros.webp',
    'Bíceps': '/src/assets/biceps.webp',
    'Tríceps': '/src/assets/triceps.webp',
    'Antebraços': '/src/assets/antebracos.jpeg',
    'Quadríceps': '/src/assets/quadriceps.webp',
    'Posterior de coxa': '/src/assets/posterior-de-coxa.webp',
    'Panturrilhas': '/src/assets/panturrilhas.png',
    'Glúteos': '/src/assets/gluteos.webp',
    'Abdômen': '/src/assets/abdomem.webp',
    'Core': '/src/assets/core.webp',
    'Cardio': '/src/assets/cardio.webp',
    'Crossfit': '/src/assets/crossfit.webp',
    'Pilates': '/src/assets/pilates.png',
    'Hipertrofia': '/src/assets/hipertrofia.webp',
    'Flexibilidade': '/src/assets/flexibilidade.webp',
    'Funcional': '/src/assets/funcional.webp'
  }
  return categoryImages[category] || '/src/assets/cardio.webp'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/src/assets/cardio.webp'
}

const today = new Date().toISOString().slice(0, 10)
const lastCompleted = computed(() => props.progress?.last_completed_at?.slice(0, 10) ?? null)
const canMarkToday = computed(() =>
  props.progress && lastCompleted.value !== today && props.progress.days_completed < props.progress.total_days
)
const daysCompleted = computed(() => props.progress?.days_completed ?? 0)
const daysRemaining = computed(() => props.progress ? Math.max(props.progress.total_days - props.progress.days_completed, 0) : 0)
const showDiasCompleted = computed(() => daysCompleted.value >= 4)
const showDiasRemaining = computed(() => daysRemaining.value >= 4)

const handleMarkDone = async () => {
  if (!props.progress) return
  try {
    await incrementProgressLog(props.progress.id)
    toast.success('Progresso atualizado!')
    emit('progress-updated')
  } catch (e: any) {
    toast.error(e?.response?.data?.message || 'Erro ao atualizar progresso')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ props.training?.name || 'Sem nome' }}</h3>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>{{ formatDuration(props.training?.duration_minutes || 0) }}</span>
          <span class="text-gray-500">•</span>
          <span class="capitalize">{{ props.training?.level || 'N/A' }}</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button 
          @click="$emit('edit', props.training)"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Editar treino"
        >
          <PencilIcon class="w-4 h-4" />
        </button>
        <button 
          @click="$emit('delete', props.training)"
          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Remover treino"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="mb-4">
      <div class="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center overflow-hidden">
        <img 
          :src="getCategoryImage(props.training?.category)"
          :alt="`Ilustração ${props.training?.category || 'exercício'}`"
          class="w-full h-full object-cover rounded-lg"
          @error="handleImageError"
        />
      </div>
    </div>
    <div v-if="props.progress" class="mb-4">
      <div class="w-full flex rounded-md overflow-hidden h-6 mb-2">
        <div
          class="flex items-center justify-center font-medium text-white text-xs"
          :style="{ flex: daysCompleted, background: '#057c60' }"
        >
          {{ daysCompleted }}<template v-if="showDiasCompleted"> dias</template>
        </div>
        <div
          class="flex items-center justify-center font-medium text-white text-xs"
          :style="{ flex: daysRemaining, background: '#d32f2f' }"
        >
          {{ daysRemaining }}<template v-if="showDiasRemaining"> dias</template>
        </div>
      </div>
      <div class="flex items-center justify-between mt-2">
        <span class="text-sm font-medium text-gray-700">Realizado hoje?</span>
        <button
          :disabled="!canMarkToday"
          @click="handleMarkDone"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#153B4E] focus:ring-offset-2"
          :class="[
            canMarkToday ? 'bg-gray-200' : 'bg-[#153B4E]',
            !canMarkToday ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              !canMarkToday ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </div>
      <div v-if="daysCompleted >= props.progress.total_days" class="text-xs text-green-700 mt-2 font-semibold">Meta atingida!</div>
      <div v-else-if="!canMarkToday" class="text-xs text-gray-500 mt-2">Já realizado hoje</div>
    </div>
    <button 
      @click="$emit('details', props.training)"
      class="w-full border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      Detalhes
    </button>
  </div>
</template>
