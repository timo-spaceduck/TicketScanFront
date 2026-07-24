<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-20">
    <AppLogo class="h-20 w-auto mb-8" />

    <h1 class="text-4xl font-bold text-highlighted text-center max-w-xl leading-tight">
      Scan tickets, manage events, run shows.
    </h1>
    <p class="mt-4 text-lg text-muted text-center max-w-lg">
      TicketScan gives you everything you need to manage ticket scanning for your events — from upload to check-in.
    </p>

    <div class="mt-10 flex gap-3 flex-wrap justify-center">
      <UButton to="/login" size="xl" leading-icon="i-lucide-log-in">
        Sign in
      </UButton>
      <UButton to="/register" size="xl" variant="outline" color="neutral">
        Create account
      </UButton>
    </div>

    <div class="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col items-center text-center"
      >
        <div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 mb-4">
          <UIcon :name="feature.icon" class="size-6 text-primary" />
        </div>
        <h3 class="font-semibold text-highlighted">{{ feature.title }}</h3>
        <p class="mt-1 text-sm text-muted">{{ feature.description }}</p>
      </div>
    </div>

    <div class="mt-24 w-full max-w-4xl">
      <h2 class="text-2xl font-bold text-highlighted text-center">
        Pricing
      </h2>
      <p class="mt-2 text-sm text-muted text-center">
        Simple plans that grow with your events.
      </p>

      <UAlert
        v-if="tariffsError"
        color="error"
        variant="soft"
        :description="tariffsError"
        icon="i-lucide-circle-alert"
        class="mt-8"
      />

      <div
        v-if="tariffsLoading"
        class="flex justify-center py-16"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-8 animate-spin text-muted"
        />
      </div>

      <TariffPricingGrid
        v-else
        :tariffs="tariffs || []"
        class="mt-8"
        @subscribe="goToRegister"
      />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: 'TicketScan — Event Ticket Management' })

const { isLoggedIn } = useAuth()

if (isLoggedIn.value) {
  await navigateTo('/dashboard/events')
}

const { tariffs, loading: tariffsLoading, error: tariffsError, fetchTariffs } = useTariffs()

onMounted(() => {
  fetchTariffs()
})

function goToRegister() {
  navigateTo('/register')
}

const features = [
  {
    icon: 'i-lucide-calendar',
    title: 'Manage Events',
    description: 'Create and organize all your events in one place.'
  },
  {
    icon: 'i-lucide-file-spreadsheet',
    title: 'Import Tickets',
    description: 'Upload your ticket lists via Excel or CSV files instantly.'
  },
  {
    icon: 'i-lucide-scan-line',
    title: 'Scan at the Door',
    description: 'Fast and reliable ticket scanning for any venue size.'
  }
]
</script>
