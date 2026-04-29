<template>
  <UModal
    :open="open"
    title="Delete scan"
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
        Are you sure you want to delete the scan for ticket
        <span class="font-semibold text-highlighted">{{ scan?.ticket_code }}</span>?
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
import { apiDeleteScan } from '~/api/scans.api'

const props = defineProps({
  open: Boolean,
  scan: { type: Object, default: null }
})

const emit = defineEmits(['update:open', 'deleted'])

const deleting = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
  if (val) error.value = ''
})

async function confirm() {
  if (!props.scan) return
  deleting.value = true
  error.value = ''
  try {
    await apiDeleteScan(props.scan.id)
    emit('update:open', false)
    emit('deleted')
  } catch {
    error.value = 'Failed to delete scan. Please try again.'
  } finally {
    deleting.value = false
  }
}
</script>
