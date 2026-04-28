import { apiClient } from '~/api/api'

export async function apiGetEvents() {
  const { data } = await apiClient.get('/shows')
  return data
}

export async function apiCreateEvent(payload) {
  const { data } = await apiClient.post('/shows', payload)
  return data
}

export async function apiUpdateEvent(id, payload) {
  const { data } = await apiClient.put(`/shows/${id}`, payload)
  return data
}

export async function apiDeleteEvent(id) {
  await apiClient.delete(`/shows/${id}`)
}
