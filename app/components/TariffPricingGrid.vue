<template>
  <div
    v-if="!tariffs.length"
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
    class="grid grid-cols-1 sm:grid-cols-3 gap-4"
  >
    <TariffCard
      v-for="tariff in tariffs"
      :key="tariff.id"
      :tariff="tariff"
      :current-tariff-id="currentTariffId"
      :current-status="currentStatus"
      :checkout-loading="checkoutLoadingId === tariff.id"
      @subscribe="$emit('subscribe', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  tariffs: { type: Array, required: true },
  currentTariffId: { type: [Number, String], default: null },
  currentStatus: { type: String, default: null },
  checkoutLoadingId: { type: [Number, String], default: null }
})

defineEmits(['subscribe'])
</script>
