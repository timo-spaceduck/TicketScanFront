<template>
  <div class="px-4 py-16 sm:py-20">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-highlighted text-center">
        Pricing
      </h1>
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
        @subscribe="handleSubscribe"
      />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Pricing - TicketScan',
  description: 'Simple, transparent pricing plans for TicketScan - event ticket scanning and management software.'
})

const { isLoggedIn } = useAuth()
const { tariffs, loading: tariffsLoading, error: tariffsError, fetchTariffs } = useTariffs()

onMounted(() => {
  fetchTariffs()
})

function handleSubscribe() {
  navigateTo(isLoggedIn.value ? '/dashboard/billing' : '/register')
}
</script>
