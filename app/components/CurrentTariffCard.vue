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
      class="flex items-center gap-4"
    >
      <div class="flex items-center justify-center size-11 rounded-xl bg-primary/10 shrink-0">
        <UIcon
          name="i-lucide-credit-card"
          class="size-6 text-primary"
        />
      </div>
      <div class="min-w-0 flex-1">
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
          {{ limitsLabel }}
        </div>
        <div
          v-if="paidUntilLabel"
          class="text-sm text-muted"
        >
          {{ paidUntilLabel }}
        </div>
      </div>
      <UButton
        v-if="canCancel"
        variant="ghost"
        color="error"
        size="sm"
        @click="$emit('cancel')"
      >
        Cancel subscription
      </UButton>
      <UButton
        v-if="isCancelled"
        variant="ghost"
        color="primary"
        size="sm"
        :loading="resuming"
        @click="$emit('resume')"
      >
        Reactivate subscription
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  tariff: { type: Object, default: null },
  paidUntil: { type: String, default: null },
  cancelAt: { type: String, default: null },
  resuming: { type: Boolean, default: false }
})

defineEmits(['cancel', 'resume'])

const isExpired = computed(() => {
  if (!props.paidUntil) return false
  return new Date(props.paidUntil) < new Date()
})

const isCancelled = computed(() => !!props.cancelAt && !isExpired.value)

const canCancel = computed(() => {
  return !props.tariff?.is_default && !!props.paidUntil && !isExpired.value && !isCancelled.value
})

const statusColor = computed(() => {
  if (props.tariff?.is_default) return 'neutral'
  if (isExpired.value || isCancelled.value) return 'warning'
  return 'success'
})

const statusLabel = computed(() => {
  if (props.tariff?.is_default) return 'Free'
  if (isExpired.value) return 'Expired'
  if (isCancelled.value) return 'Cancelled'
  return 'Active'
})

const limitsLabel = computed(() => {
  const shows = props.tariff?.max_shows
  const tickets = props.tariff?.max_tickets
  const parts = []
  if (shows != null) parts.push(`${shows} event${shows === 1 ? '' : 's'}`)
  if (tickets != null) parts.push(`${tickets.toLocaleString()} tickets`)
  return parts.join(' · ')
})

const paidUntilLabel = computed(() => {
  if (!props.paidUntil) return ''
  const formatted = formatDate(props.paidUntil)
  if (isExpired.value) return `Expired on ${formatted}`
  if (isCancelled.value) return `Access until ${formatted}`
  return `Paid until ${formatted}`
})

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
