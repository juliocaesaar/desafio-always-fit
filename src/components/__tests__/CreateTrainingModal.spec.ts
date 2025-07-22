import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateTrainingModal from '../CreateTrainingModal.vue'

describe('CreateTrainingModal', () => {
  it('renderiza o título do modal', () => {
    const wrapper = mount(CreateTrainingModal, {
      props: { show: true }
    })
    expect(wrapper.text()).toContain('Criar Novo Treino')
  })
}) 