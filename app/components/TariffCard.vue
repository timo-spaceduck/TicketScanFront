<template>
  <UCard :class="isCurrent ? 'ring-2 ring-primary' : ''">
    <div class="flex flex-col h-full">
      <div class="mb-4">
        <div class="text-lg font-bold text-highlighted">
          {{ tariff.name }}
        </div>
        <div class="mt-1 flex items-baseline gap-1">
          <span class="text-2xl font-bold text-highlighted">{{ priceLabel }}</span>
          <span
            v-if="!tariff.is_default"
            class="text-sm text-muted"
          >
            per month
          </span>
        </div>
      </div>

      <ul class="space-y-2 mb-6 flex-1">
        <li
          v-for="feature in featureList"
          :key="feature"
          class="flex items-start gap-2 text-sm text-muted"
        >
          <UIcon
            name="i-lucide-check"
            class="size-4 text-primary mt-0.5 shrink-0"
          />
          {{ feature }}
        </li>
      </ul>

      <UButton
        block
        :disabled="isDisabled"
        :loading="checkoutLoading"
        @click="$emit('subscribe', tariff)"
      >
        {{ buttonLabel }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  tariff: { type: Object, required: true },
  currentTariffId: { type: [Number, String], default: null },
  checkoutLoading: Boolean
})

defineEmits(['subscribe'])

const isCurrent = computed(() => props.tariff.id === props.currentTariffId)

const isDisabled = computed(() => {
  if (isCurrent.value) return true
  if (props.tariff.is_default) return false
  return !props.tariff.paddle_price_id
})

const buttonLabel = computed(() => {
  if (isCurrent.value) return 'Current plan'
  if (props.tariff.is_default) return 'Get started'
  if (!props.tariff.paddle_price_id) return 'Unavailable'
  return props.currentTariffId ? 'Switch to this plan' : 'Subscribe'
})

const featureList = computed(() => {
  const shows = props.tariff.max_shows
  const tickets = props.tariff.max_tickets
  const list = []
  if (shows != null) list.push(`${shows} event${shows === 1 ? '' : 's'}`)
  if (tickets != null) list.push(`${tickets.toLocaleString()} tickets`)
  return list
})

const priceLabel = computed(() => {
  const tariff = props.tariff
  const amount = (tariff.price_cents ?? 0) / 100
  if (!tariff.currency) return amount
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: tariff.currency }).format(amount)
  } catch {
    return `${amount} ${tariff.currency}`
  }
})
</script>
