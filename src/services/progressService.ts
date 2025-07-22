import api from './api'
import type { ProgressLog } from '@/types'

const baseUrl = '/progress-logs'

export const getProgressLogs = async (): Promise<ProgressLog[]> => {
  const response = await api.get(baseUrl)
  return response.data.progress_logs || []
}

export const incrementProgressLog = async (id: number): Promise<ProgressLog> => {
  const response = await api.patch(`${baseUrl}/${id}/increment`)
  return response.data.progress
}

export const deleteProgressLog = async (id: number) => {
  const response = await api.delete(`${baseUrl}/${id}`)
  return response.data
}