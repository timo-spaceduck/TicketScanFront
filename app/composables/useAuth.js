export function useAuth() {
  const token = useCookie('auth_token')
  const userName = useCookie('auth_user_name')

  const isLoggedIn = computed(() => !!token.value)

  function logout() {
    token.value = null
    userName.value = null
    return navigateTo('/login')
  }

  return { token, userName, isLoggedIn, logout }
}
