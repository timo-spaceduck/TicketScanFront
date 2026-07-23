import { apiClient } from '~/api/api'

export async function apiGetTariffs() {
  const { data } = await apiClient.get('/billing/tariffs')
  return Array.isArray(data) ? data : (data.data ?? data)
}
