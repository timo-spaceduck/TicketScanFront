import { apiClient } from '~/api/api'

export async function apiGetEvent(eventId) {
  const { data } = await apiClient.get(`/shows/${eventId}`)
  return data
}

export async function apiGetEventTickets(eventId) {
  const { data } = await apiClient.get(`/shows/${eventId}/tickets`)
  return data
}

export async function apiPostScans(eventId, scans) {
  const { data } = await apiClient.post('/scans/bulk', { event_id: eventId, scans })
  return data
}
