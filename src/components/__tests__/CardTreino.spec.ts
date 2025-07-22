import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardTreino from '../CardTreino.vue'

describe('CardTreino', () => {
  it('renderiza o nome do treino', () => {
    const treino = {
      id: 1,
      name: 'Treino Simples',
      description: '',
      duration_minutes: 30,
      category: 'Cardio',
      level: 'iniciante',
      finished: false,
      total_days: 10,
      user_id: 1,
      created_at: '',
      updated_at: ''
    }
    const wrapper = mount(CardTreino, {
      props: { training: treino }
    })
    expect(wrapper.text()).toContain('Treino Simples')
  })
}) 