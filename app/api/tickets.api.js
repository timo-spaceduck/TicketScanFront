import { apiClient } from '~/api/api'

export async function apiUploadTickets(eventId, file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post(`/shows/${eventId}/tickets/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}
