<template>
  <UModal
    :open="open"
    title="Cancel subscription"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :description="error"
        icon="i-lucide-circle-alert"
        class="mb-3"
      />
      <p class="text-sm text-muted">
        Are you sure you want to cancel your subscription? You'll keep access to your current plan
        until it expires, then your account will move to the free plan.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          @click="$emit('update:open', false)"
        >
          Keep subscription
        </UButton>
        <UButton
          color="error"
          :loading="cancelling"
          @click="confirm"
        >
          Cancel subscription
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { apiCancelSubscription } from '~/api/tariffs.api'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open', 'cancelled'])

const cancelling = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
  if (val) error.value = ''
})

async function confirm() {
  cancelling.value = true
  error.value = ''
  try {
    await apiCancelSubscription()
    emit('update:open', false)
    emit('cancelled')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to cancel subscription. Please try again.'
  } finally {
    cancelling.value = false
  }
}
</script>
