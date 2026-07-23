import { apiGetTariffs } from '~/api/tariffs.api'

export function useTariffs() {
  const tariffs = useState('tariffs_list', () => null)
  const loading = useState('tariffs_loading', () => false)
  const error = useState('tariffs_error', () => '')

  async function fetchTariffs(force = false) {
    if (tariffs.value && !force) return tariffs.value

    loading.value = true
    error.value = ''
    try {
      tariffs.value = await apiGetTariffs()
    } catch {
      error.value = 'Failed to load tariffs.'
      tariffs.value = []
    } finally {
      loading.value = false
    }
    return tariffs.value
  }

  return { tariffs, loading, error, fetchTariffs }
}
