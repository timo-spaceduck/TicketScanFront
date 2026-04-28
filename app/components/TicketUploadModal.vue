<template>
  <UModal
    :open="open"
    :title="event ? `Upload tickets — ${event.title}` : 'Upload tickets'"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <TicketUploadForm
        :preselected-event="event"
        @uploaded="$emit('update:open', false)"
      />
    </template>
  </UModal>
</template>

<script setup>
defineProps({
  open: Boolean,
  event: { type: Object, default: null }
})

defineEmits(['update:open'])
</script>
