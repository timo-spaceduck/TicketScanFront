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

    <div
      v-if="pageLoading"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <template v-else>
      <CurrentTariffCard
        :tariff="user?.tariff"
        :paid-until="user?.paid_until"
        :cancel-at="subscription?.cancel_at"
        :resuming="resuming"
        class="mb-8"
        @cancel="cancelModalOpen = true"
        @resume="handleResume"
      />

      <UAlert
        v-if="tariffsError"
        color="error"
        variant="soft"
        :description="tariffsError"
        icon="i-lucide-circle-alert"
        class="mb-4"
      />

      <TariffPricingGrid
        :tariffs="tariffs || []"
        :current-tariff-id="user?.tariff?.id"
        :checkout-loading-id="checkoutLoadingId"
        align="start"
        @subscribe="subscribe"
      />
    </template>

    <CancelSubscriptionModal
      v-model:open="cancelModalOpen"
      @cancelled="handleCancelled"
    />
  </div>
</template>

<script setup>
import { apiCreateCheckout, apiGetSubscription, apiResumeSubscription } from '~/api/tariffs.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Billing - TicketScan' })

const { user, fetchMe } = useAuth()
const { tariffs, error: tariffsError, fetchTariffs } = useTariffs()
const { getPaddle, onCheckoutEvent } = usePaddle()
const toast = useToast()

const checkoutLoadingId = ref(null)
const cancelModalOpen = ref(false)
const subscription = ref(null)
const pageLoading = ref(true)
const resuming = ref(false)

let unsubscribe = null

onMounted(async () => {
  unsubscribe = onCheckoutEvent(handleCheckoutEvent)
  await Promise.all([fetchTariffs(), fetchSubscription(), fetchMe()])
  pageLoading.value = false
})

async function fetchSubscription() {
  try {
    const data = await apiGetSubscription()
    subscription.value = data?.subscription ?? null
  } catch {
    subscription.value = null
  }
}

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

async function handleCancelled() {
  await Promise.all([fetchMe(), fetchSubscription()])
  toast.add({
    title: 'Subscription cancelled',
    description: 'Your subscription will not renew. You\'ll keep access until it expires.',
    color: 'success'
  })
}

async function handleResume() {
  resuming.value = true
  try {
    await apiResumeSubscription()
    await Promise.all([fetchMe(), fetchSubscription()])
    toast.add({
      title: 'Subscription reactivated',
      description: 'Your subscription will continue to renew.',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Reactivation failed',
      description: err?.response?.data?.message || 'Could not reactivate your subscription. Please try again.',
      color: 'error'
    })
  } finally {
    resuming.value = false
  }
}

async function handleCheckoutEvent(event) {
  // Any event means Paddle's own overlay/spinner has taken over - stop showing our button spinner.
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

  await fetchSubscription()

  toast.add({
    title: 'Subscription updated',
    description: 'Your tariff has been updated.',
    color: 'success'
  })
}
</script>
