import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardResumo from '../DashboardResumo.vue'

describe('DashboardResumo', () => {
  it('renderiza os textos dos cards principais', () => {
    const wrapper = mount(DashboardResumo)
    expect(wrapper.text()).toContain('Treinos')
    expect(wrapper.text()).toContain('Refeições')
    expect(wrapper.text()).toContain('Registros de Progresso')
  })
}) 