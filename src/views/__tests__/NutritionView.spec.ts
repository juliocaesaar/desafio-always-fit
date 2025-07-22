import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import NutritionView from '../NutritionView.vue'

describe('NutritionView', () => {
  it('exibe o título principal', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })
    const wrapper = mount(NutritionView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text().toLowerCase()).toContain('refeições')
  })
}) 