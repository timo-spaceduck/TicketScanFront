<template>
  <UModal
    :open="open"
    title="Clear scan logs"
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
        Are you sure you want to clear all scan logs for
        <span class="font-semibold text-highlighted">{{ event?.title }}</span>?
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
          Clear logs
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { apiDeleteScans } from '~/api/scanner.api'

const props = defineProps({
  open: Boolean,
  event: { type: Object, default: null }
})

const emit = defineEmits(['update:open', 'cleared'])

const deleting = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
  if (val) error.value = ''
})

async function confirm() {
  if (!props.event) return
  deleting.value = true
  error.value = ''
  try {
    await apiDeleteScans(props.event.id)
    emit('update:open', false)
    emit('cleared')
  } catch {
    error.value = 'Failed to clear scan logs. Please try again.'
  } finally {
    deleting.value = false
  }
}
</script>
