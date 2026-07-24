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
      :paid-until="user?.paid_until"
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
      :checkout-loading-id="checkoutLoadingId"
      @subscribe="subscribe"
    />
  </div>
</template>

<script setup>
import { apiCreateCheckout } from '~/api/tariffs.api'

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

  let transactionId
  try {
    const checkout = await apiCreateCheckout(tariff.id)
    transactionId = checkout.transaction_id
    if (!transactionId) throw new Error('Missing transaction id')
  } catch (err) {
    toast.add({
      title: 'Checkout failed',
      description: err?.response?.data?.message || 'Could not start checkout. Please try again.',
      color: 'error'
    })
    checkoutLoadingId.value = null
    return
  }

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

  paddle.Checkout.open({ transactionId })

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
  const previousPaidUntil = user.value?.paid_until
  await fetchMe()

  if (event.name !== 'checkout.completed') return

  for (let i = 0; i < 5; i++) {
    const changed = user.value?.tariff?.id !== previousTariffId || user.value?.paid_until !== previousPaidUntil
    if (changed) break
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
