<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Billing
      </h1>
      <p class="text-sm text-muted mt-0.5">
        Manage your subscription
      </p>
    </div>

    <CurrentTariffCard
      :tariff="user?.tariff"
      class="mb-8"
    />

    <UAlert
      v-if="tariffsError"
      color="error"
      variant="soft"
      :description="tariffsError"
      icon="i-lucide-circle-alert"
      class="mb-4"
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
      :current-tariff-id="user?.tariff?.id"
      :current-status="user?.tariff?.status"
      :checkout-loading-id="checkoutLoadingId"
      @subscribe="subscribe"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Billing — TicketScan' })

const { user, fetchMe } = useAuth()
const { tariffs, loading: tariffsLoading, error: tariffsError, fetchTariffs } = useTariffs()
const { getPaddle, onCheckoutEvent } = usePaddle()
const toast = useToast()

const checkoutLoadingId = ref(null)

let unsubscribe = null

onMounted(() => {
  fetchTariffs()
  unsubscribe = onCheckoutEvent(handleCheckoutEvent)
})

onUnmounted(() => {
  unsubscribe?.()
})

async function subscribe(tariff) {
  checkoutLoadingId.value = tariff.id

  const paddle = await getPaddle()
  if (!paddle) {
    toast.add({
      title: 'Payment unavailable',
      description: 'Could not load the payment provider. Please try again later.',
      color: 'error'
    })
    checkoutLoadingId.value = null
    return
  }

  paddle.Checkout.open({
    items: [{ priceId: tariff.paddle_price_id, quantity: 1 }],
    ...(user.value?.email ? { customer: { email: user.value.email } } : {})
  })

  // Safety net: clear the button spinner even if Paddle never emits a single event.
  const openedForId = tariff.id
  setTimeout(() => {
    if (checkoutLoadingId.value === openedForId) checkoutLoadingId.value = null
  }, 10000)
}

async function handleCheckoutEvent(event) {
  // Any event means Paddle's own overlay/spinner has taken over — stop showing our button spinner.
  checkoutLoadingId.value = null

  if (event.name !== 'checkout.closed' && event.name !== 'checkout.completed'
    && event.name !== 'checkout.error' && event.name !== 'checkout.failed') return

  if (event.name === 'checkout.error' || event.name === 'checkout.failed') {
    toast.add({
      title: 'Payment failed',
      description: 'Something went wrong during checkout. Please try again.',
      color: 'error'
    })
    return
  }

  const previousTariffId = user.value?.tariff?.id
  const previousStatus = user.value?.tariff?.status
  await fetchMe()

  if (event.name !== 'checkout.completed') return

  for (let i = 0; i < 5; i++) {
    const changed = user.value?.tariff?.id !== previousTariffId || user.value?.tariff?.status !== previousStatus
    if (changed && user.value?.tariff?.status === 'active') break
    await new Promise(resolve => setTimeout(resolve, 1500))
    await fetchMe()
  }

  toast.add({
    title: 'Subscription updated',
    description: 'Your tariff has been updated.',
    color: 'success'
  })
}
</script>
