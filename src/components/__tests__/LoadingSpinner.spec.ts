import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renderiza o componente e o loader', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('.loader').exists()).toBe(true)
  })
}) 