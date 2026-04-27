import { apiClient } from '~/api/api'

export async function apiLogin(payload) {
  const { data } = await apiClient.post('/auth/login', payload)
  return data
}

export async function apiRegister(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}

export async function apiMe() {
  const { data } = await apiClient.get('/auth/me')
  return data
}
