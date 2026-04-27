import axios from 'axios'

function readCookie(name) {
  if (!import.meta.client) return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export const apiClient = axios.create()

apiClient.interceptors.request.use((config) => {
  const { public: { apiHost, apiKey } } = useRuntimeConfig()

  config.baseURL = apiHost
  config.headers['x-api-token'] = apiKey

  const token = readCookie('auth_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

export async function apiLogin(payload) {
  const { data } = await apiClient.post('/auth/login', payload)
  return data
}

export async function apiRegister(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}
