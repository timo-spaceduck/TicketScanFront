<template>
  <div class="h-dvh bg-default text-highlighted flex flex-col">
    <header class="flex items-center gap-3 px-4 h-14 bg-elevated border-b border-default shrink-0">
      <NuxtLink
        to="/dashboard"
        class="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-5 text-muted"
        />
      </NuxtLink>
      <AppLogo class="h-8 w-auto" />
      <span class="text-sm font-semibold text-highlighted">Scanner</span>
    </header>

    <div class="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-sm">
        <h1 class="text-xl font-bold text-highlighted mb-1">
          Select event
        </h1>
        <p class="text-sm text-muted mb-6">
          Choose the event you want to scan tickets for.
        </p>

        <div
          v-if="loading"
          class="flex justify-center py-12"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-8 animate-spin text-muted"
          />
        </div>

        <div
          v-else-if="error"
          class="text-sm text-red-500 text-center py-8"
        >
          {{ error }}
        </div>

        <div
          v-else-if="events.length === 0"
          class="text-sm text-muted text-center py-8"
        >
          No events found.
        </div>

        <div
          v-else
          class="space-y-2"
        >
          <button
            v-for="event in events"
            :key="event.id"
            class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-elevated hover:bg-muted border border-default transition-colors text-left"
            @click="selectEvent(event.id)"
          >
            <div class="flex items-center justify-center size-10 rounded-lg bg-primary/15 shrink-0">
              <UIcon
                name="i-lucide-calendar"
                class="size-5 text-primary"
              />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-highlighted truncate">
                {{ event.title }}
              </p>
              <p
                v-if="event.description"
                class="text-xs text-muted truncate"
              >
                {{ event.description }}
              </p>
            </div>
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 text-muted shrink-0 ml-auto"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { apiGetEvents } from '~/api/events.api'

definePageMeta({ layout: 'scanner', middleware: 'auth' })
useSeoMeta({ title: 'Scanner — TicketScan' })

const router = useRouter()
const events = ref([])
const loading = ref(false)
const error = ref('')

function selectEvent(id) {
  router.push(`/scanner/${id}`)
}

onMounted(async () => {
  loading.value = true
  try {
    events.value = await apiGetEvents()
  } catch {
    error.value = 'Failed to load events.'
  } finally {
    loading.value = false
  }
})
</script>
