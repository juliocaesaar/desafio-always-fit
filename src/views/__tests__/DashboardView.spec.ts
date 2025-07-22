import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../DashboardView.vue'

describe('DashboardView', () => {
  it('exibe mensagem de boas-vindas', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('Olá')
  })
}) 