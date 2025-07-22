<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="relative bg-[#F6F6FA] rounded-lg shadow-2xl w-full max-w-md mx-auto">
      <div class="p-8">
        <div class="text-center mb-6">
          <img src="@/assets/logo.png" alt="AlwaysFit" class="h-7 w-auto mx-auto" />
        </div>

        <h1 class="text-2xl font-bold text-gray-900 text-center mb-4">Registro</h1>
        
        <div class="text-start mb-6">
          <p class="text-gray-700 text-lg mb-2">Bem-vindo!</p>
          <p class="text-sm text-gray-600 mb-1">Este é o ambiente seguro de registro da Always Fit ®</p>
        </div>
        
        <p class="text-sm font-bold text-gray-700 mb-2">Para criar sua conta, preencha os dados abaixo.</p>

        <form @submit.prevent="handleRegister" class="space-y-1">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nome completo"
              class="w-full text-sm px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              :class="{ 'border-red-500': errors.name }"
              required
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

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
              placeholder="Senha (mínimo 6 caracteres)"
              class="w-full text-sm px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              :class="{ 'border-red-500': errors.password }"
              required
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <input
              v-model="form.confirm_password"
              type="password"
              placeholder="Confirme sua senha"
              class="w-full text-sm px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              :class="{ 'border-red-500': errors.confirm_password }"
              required
            />
            <p v-if="errors.confirm_password" class="text-red-500 text-sm mt-1">{{ errors.confirm_password }}</p>
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
            {{ loading ? 'Registrando...' : 'Registrar' }}
          </button>
        </form>
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Já tem uma conta?
            <router-link to="/login" class="text-blue-500 hover:text-blue-600">Faça login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
})

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
})

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirm_password = ''
  
  if (!form.name) {
    errors.name = 'Nome é obrigatório'
  }
  
  if (!form.email) {
    errors.email = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido'
  }
  
  if (!form.password) {
    errors.password = 'Senha é obrigatória'
  } else if (form.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
  }
  
  if (!form.confirm_password) {
    errors.confirm_password = 'Confirmação de senha é obrigatória'
  } else if (form.password !== form.confirm_password) {
    errors.confirm_password = 'Senhas não coincidem'
  }
  
  return !Object.values(errors).some(error => error !== '')
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await api.post('/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password,
    })
    
    toast.success('Registro realizado com sucesso! Você já pode fazer login.')
    
    Object.keys(form).forEach(key => {
      (form as any)[key] = ''
    })
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (e: any) {
    toast.error(e?.response?.data?.message || e?.message || 'Falha no registro')
  } finally {
    loading.value = false
  }
}
</script>