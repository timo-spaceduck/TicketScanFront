export default defineNuxtPlugin(async () => {
  const { token, fetchMe } = useAuth()
  if (token.value) {
    await fetchMe()
  }
})
