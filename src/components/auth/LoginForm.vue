<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="relative bg-[#F6F6FA] rounded-lg shadow-2xl w-full max-w-md mx-auto">
      <div class="p-8">
        <div class="text-center mb-6">
          <img src="@/assets/logo.png" alt="AlwaysFit" class="h-7 w-auto mx-auto" />
        </div>

        <h1 class="text-2xl font-bold text-gray-900 text-center mb-4">Login</h1>
        
        <div class="text-start mb-6">
          <p class="text-gray-700 text-lg mb-2">Olá!</p>
          <p class="text-sm text-gray-600 mb-1">Este é o ambiente seguro de login da Always Fit ®</p>
        </div>
        
        <p class="text-sm font-bold text-gray-700 mb-2">Para acessar, informe suas credenciais.</p>

        <form @submit.prevent="handleLogin" class="space-y-1">
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="E-mail"
              class="w-full text-sm px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              :class="{ 'border-red-500': errors.email }"
              required
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <input
              v-model="form.password"
              type="password"
              placeholder="Senha"
              class="w-full text-sm px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              :class="{ 'border-red-500': errors.password }"
              required
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#153B4E] hover:bg-[#0f2a38] disabled:bg-gray-400 text-white font-medium text-sm py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Entrando...' : 'Logar' }}
          </button>
        </form>
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">Não tem uma conta? <a href="/register" class="text-blue-500 hover:text-blue-600">Registre-se</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

const form = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido'
  }
  
  if (!form.password) {
    errors.password = 'Senha é obrigatória'
  }
  
  return !errors.email && !errors.password
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await authStore.login(form.email, form.password)
    toast.success('Login realizado com sucesso!')
    router.push('/')
  } catch (e: any) {
    const errorResponse = e?.response?.data
    if (errorResponse?.error) {
      toast.error(errorResponse.error)
    } else {
      toast.error(e?.message || 'Erro no Servidor.')
    }
  } finally {
    loading.value = false
  }
}
</script>
