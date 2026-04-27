import { apiMe } from '~/api/auth.api'

export function useAuth() {
  const token = useCookie('auth_token')
  const user = useState('auth_user', () => null)

  const isLoggedIn = computed(() => !!token.value)

  async function fetchMe() {
    try {
      const data = await apiMe()
      user.value = data
    } catch {
      token.value = null
      user.value = null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  return { token, user, isLoggedIn, fetchMe, logout }
}
