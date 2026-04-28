<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Overview
      </h1>
      <p class="text-sm text-muted mt-0.5">
        Your TicketScan at a glance
      </p>
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      :description="error"
      icon="i-lucide-circle-alert"
    />

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      <UCard
        v-for="stat in stats"
        :key="stat.label"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center size-11 rounded-xl bg-primary/10 shrink-0">
            <UIcon
              :name="stat.icon"
              class="size-6 text-primary"
            />
          </div>
          <div class="min-w-0">
            <div class="text-2xl font-bold text-highlighted">
              {{ stat.value }}
            </div>
            <div class="text-sm text-muted truncate">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { apiGetStats } from '~/api/stats.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Overview — TicketScan' })

const loading = ref(false)
const error = ref('')
const statsData = ref(null)

const stats = computed(() => [
  {
    label: 'Events',
    icon: 'i-lucide-calendar',
    value: statsData.value?.shows || '—'
  },
  {
    label: 'Tickets loaded',
    icon: 'i-lucide-file-spreadsheet',
    value: statsData.value?.tickets || '—'
  },
  {
    label: 'Tickets validated',
    icon: 'i-lucide-check-circle',
    value: statsData.value?.validated || '—'
  }
])

onMounted(async () => {
  loading.value = true
  try {
    statsData.value = await apiGetStats()
  } catch {
    error.value = 'Failed to load statistics.'
  } finally {
    loading.value = false
  }
})
</script>
