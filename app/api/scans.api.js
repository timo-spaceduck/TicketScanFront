import { apiClient } from '~/api/api'

export async function apiGetScans(page = 1, perPage = 20) {
  const { data } = await apiClient.get('/scans', { params: { page, per_page: perPage } })
  return data
}

export async function apiDeleteScan(scanId) {
  await apiClient.delete(`/scans/${scanId}`)
}
