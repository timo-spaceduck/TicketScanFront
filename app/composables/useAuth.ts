export function useAuth() {
  const token = useCookie<string | null>('auth_token')
  const userName = useCookie<string | null>('auth_user_name')

  const isLoggedIn = computed(() => !!token.value)

  function logout() {
    token.value = null
    userName.value = null
    return navigateTo('/login')
  }

  return { token, userName, isLoggedIn, logout }
}