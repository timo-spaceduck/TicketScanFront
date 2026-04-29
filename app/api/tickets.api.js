import { apiClient } from '~/api/api'

export async function apiUploadTickets(eventId, file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post(`/shows/${eventId}/tickets/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function apiGetTickets(eventId, page = 1, perPage = 20) {
  const { data } = await apiClient.get(`/shows/${eventId}/tickets`, { params: { page, per_page: perPage } })
  return data
}

export async function apiCreateTicket(eventId, payload) {
  const { data } = await apiClient.post(`/shows/${eventId}/tickets`, payload)
  return data
}

export async function apiUpdateTicket(eventId, ticketId, payload) {
  const { data } = await apiClient.put(`/shows/${eventId}/tickets/${ticketId}`, payload)
  return data
}

export async function apiDeleteTicket(eventId, ticketId) {
  await apiClient.delete(`/shows/${eventId}/tickets/${ticketId}`)
}
