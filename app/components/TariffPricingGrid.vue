<template>
  <div
    v-if="!visibleTariffs.length"
    class="flex flex-col items-center py-16 text-center"
  >
    <UIcon
      name="i-lucide-package-x"
      class="size-12 mb-3 text-muted"
    />
    <p class="text-muted text-sm">
      No tariffs are available right now.
    </p>
  </div>

  <div
    v-else
    class="flex flex-wrap gap-4"
    :class="align === 'start' ? 'justify-start' : 'justify-center'"
  >
    <div
      v-for="tariff in visibleTariffs"
      :key="tariff.id"
      class="w-full sm:w-72"
    >
      <TariffCard
        :tariff="tariff"
        :current-tariff-id="currentTariffId"
        :checkout-loading="checkoutLoadingId === tariff.id"
        @subscribe="$emit('subscribe', $event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tariffs: { type: Array, required: true },
  currentTariffId: { type: [Number, String], default: null },
  checkoutLoadingId: { type: [Number, String], default: null },
  align: { type: String, default: 'center' }
})

defineEmits(['subscribe'])

const visibleTariffs = computed(() => {
  const current = props.tariffs.find(t => t.id === props.currentTariffId)
  const hasPaidPlan = !!current && !current.is_default
  return props.tariffs.filter(t => !(t.is_default && hasPaidPlan))
})
</script>
