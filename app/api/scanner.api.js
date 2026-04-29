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
  const { data } = await apiClient.post('/scans/bulk', { show_id: eventId, scans })
  return data
}

export async function apiLookupScan(eventId, code) {
  const { data } = await apiClient.post('/scans/lookup', { show_id: eventId, code })
  return data
}

export async function apiDeleteScans(eventId) {
  await apiClient.delete(`/shows/${eventId}/scans`)
}
