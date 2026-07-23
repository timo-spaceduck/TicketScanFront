<template>
  <UCard :class="isCurrent ? 'ring-2 ring-primary' : ''">
    <div class="flex flex-col h-full">
      <div class="mb-4">
        <div class="text-lg font-bold text-highlighted">
          {{ tariff.name }}
        </div>
        <div class="mt-1">
          <span class="text-2xl font-bold text-highlighted">{{ priceLabel }}</span>
          <span class="text-sm text-muted">{{ intervalLabel }}</span>
        </div>
      </div>

      <ul
        v-if="tariff.features?.length"
        class="space-y-2 mb-6 flex-1"
      >
        <li
          v-for="feature in tariff.features"
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
        :disabled="isCurrent"
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
  currentStatus: { type: String, default: null },
  checkoutLoading: Boolean
})

defineEmits(['subscribe'])

const isCurrent = computed(() => {
  return props.currentStatus === 'active' && props.tariff.id === props.currentTariffId
})

const buttonLabel = computed(() => {
  if (isCurrent.value) return 'Current plan'
  return props.currentTariffId ? 'Switch to this plan' : 'Subscribe'
})

const priceLabel = computed(() => {
  const tariff = props.tariff
  if (!tariff.currency) return tariff.price
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: tariff.currency }).format(tariff.price)
  } catch {
    return `${tariff.price} ${tariff.currency}`
  }
})

const intervalLabel = computed(() => {
  if (props.tariff.interval === 'year') return ' / year'
  if (props.tariff.interval === 'month') return ' / month'
  return ''
})
</script>
