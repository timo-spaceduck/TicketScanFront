import { apiClient } from '~/api/api'

export async function apiGetStats() {
  const { data } = await apiClient.get('/stats')
  return data
}
