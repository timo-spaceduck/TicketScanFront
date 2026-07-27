import { apiClient } from '~/api/api'

export async function apiGetTariffs() {
  const { data } = await apiClient.get('/billing/tariffs')
  return Array.isArray(data) ? data : (data.data ?? data)
}

export async function apiCreateCheckout(tariffId) {
  const { data } = await apiClient.post('/billing/checkout', { tariff_id: tariffId })
  return data
}

export async function apiCancelSubscription() {
  const { data } = await apiClient.post('/billing/cancel')
  return data
}
