<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { incrementProgressLog } from '@/services/progressService'
import { useToast } from 'vue-toastification'
import type { ProgressLog } from '@/types'

const props = defineProps<{ progress: ProgressLog }>()
const emit = defineEmits(['updated', 'delete'])

const toast = useToast()

const today = new Date().toISOString().slice(0, 10)
const lastCompleted = props.progress.last_completed_at?.slice(0, 10) ?? null

const canMarkToday = computed(() =>
  lastCompleted !== today && props.progress.days_completed < props.progress.total_days
)

const daysRemaining = computed(() =>
  Math.max(props.progress.total_days - props.progress.days_completed, 0)
)

const handleMarkDone = async () => {
  try {
    await incrementProgressLog(props.progress.id)
    toast.success('Progresso atualizado!')
    emit('updated')
  } catch (e: any) {
    toast.error(e?.response?.data?.message || 'Erro ao atualizar progresso')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 border border-gray-200 relative">
    <button 
      @click="$emit('delete', props.progress)"
      class="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
      title="Remover progresso"
    >
      <TrashIcon class="w-4 h-4" />
    </button>
    
    <div class="mb-4">
      <h3 class="font-semibold text-gray-600 mb-2">
        {{ progress.training?.name || 'Treino' }}
      </h3>
      <div class="space-y-2 text-sm text-gray-600">
        <p v-if="progress.training?.description">{{ progress.training.description }}</p>
        <p class="font-semibold">
          Iniciado:
          {{ progress.training?.created_at
            ? new Date(progress.training.created_at).toLocaleDateString('pt-BR')
            : '-' }}
        </p>
      </div>
    </div>
    <div class="w-full flex rounded-md overflow-hidden h-6 mt-4 mb-4">
      <div
        class="flex items-center justify-center font-medium text-white text-xs"
        :style="{ flex: progress.days_completed, background: '#057c60' }"
      >
        {{ progress.days_completed }} dias
      </div>
      <div
        class="flex items-center justify-center font-medium text-white text-xs"
        :style="{ flex: daysRemaining, background: '#d32f2f' }"
      >
        {{ daysRemaining }} dias
      </div>
    </div>
    <button
      :disabled="!canMarkToday"
      @click="handleMarkDone"
      class="w-full py-2 rounded-md font-semibold text-white transition-colors"
      :class="canMarkToday ? 'bg-[#153B4E] hover:bg-[#0f2a38]' : 'bg-gray-300 cursor-not-allowed'"
    >
      <template v-if="progress.days_completed >= progress.total_days">
        Meta atingida!
      </template>
      <template v-else>
        {{ canMarkToday ? 'Marcar como feito' : 'Já realizado hoje' }}
      </template>
    </button>
  </div>
</template>
