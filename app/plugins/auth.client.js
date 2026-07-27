export default defineNuxtPlugin(() => {
  const { token, fetchMe } = useAuth()
  if (token.value) {
    fetchMe()
  }
})
