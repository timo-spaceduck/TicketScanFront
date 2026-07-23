<template>
  <UCard>
    <div
      v-if="!tariff"
      class="flex items-center gap-4"
    >
      <div class="flex items-center justify-center size-11 rounded-xl bg-elevated shrink-0">
        <UIcon
          name="i-lucide-credit-card"
          class="size-6 text-muted"
        />
      </div>
      <div class="min-w-0">
        <div class="text-lg font-bold text-highlighted">
          No active plan
        </div>
        <div class="text-sm text-muted">
          Choose a tariff below to get started
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-center justify-between gap-4 flex-wrap"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center justify-center size-11 rounded-xl bg-primary/10 shrink-0">
          <UIcon
            name="i-lucide-credit-card"
            class="size-6 text-primary"
          />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-highlighted">{{ tariff.name }}</span>
            <UBadge
              :color="statusColor"
              variant="subtle"
              size="sm"
            >
              {{ statusLabel }}
            </UBadge>
          </div>
          <div class="text-sm text-muted mt-0.5">
            {{ paidUntilLabel }}
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  tariff: { type: Object, default: null }
})

const statusColor = computed(() => {
  switch (props.tariff?.status) {
    case 'active': return 'success'
    case 'expired': return 'warning'
    case 'canceled': return 'neutral'
    default: return 'neutral'
  }
})

const statusLabel = computed(() => {
  switch (props.tariff?.status) {
    case 'active': return 'Active'
    case 'expired': return 'Expired'
    case 'canceled': return 'Canceled'
    default: return props.tariff?.status || ''
  }
})

const paidUntilLabel = computed(() => {
  if (!props.tariff?.paid_until) return ''
  const formatted = formatDate(props.tariff.paid_until)
  if (props.tariff.status === 'expired') return `Expired on ${formatted}`
  if (props.tariff.status === 'canceled') return `Access until ${formatted}`
  return `Paid until ${formatted}`
})

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
