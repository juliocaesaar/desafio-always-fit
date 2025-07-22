import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import TrainingsView from '../TrainingsView.vue'

describe('TrainingsView', () => {
  it('exibe o título principal', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })
    const wrapper = mount(TrainingsView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('Seus treinos de hoje')
  })
}) 