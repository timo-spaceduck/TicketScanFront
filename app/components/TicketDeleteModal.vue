<template>
  <UModal
    :open="open"
    title="Delete ticket"
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
        Are you sure you want to delete ticket
        <span class="font-semibold text-highlighted">{{ ticket?.code }}</span>?
        This action cannot be undone.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          @click="$emit('update:open', false)"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          :loading="deleting"
          @click="confirm"
        >
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { apiDeleteTicket } from '~/api/tickets.api'

const props = defineProps({
  open: Boolean,
  eventId: { type: [String, Number], required: true },
  ticket: { type: Object, default: null }
})

const emit = defineEmits(['update:open', 'deleted'])

const deleting = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
  if (val) error.value = ''
})

async function confirm() {
  if (!props.ticket) return
  deleting.value = true
  error.value = ''
  try {
    await apiDeleteTicket(props.eventId, props.ticket.id)
    emit('update:open', false)
    emit('deleted')
  } catch {
    error.value = 'Failed to delete ticket. Please try again.'
  } finally {
    deleting.value = false
  }
}
</script>
