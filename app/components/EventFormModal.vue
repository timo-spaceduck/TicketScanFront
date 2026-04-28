<template>
  <UModal
    :open="open"
    :title="event ? 'Edit event' : 'New event'"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :description="error"
        icon="i-lucide-circle-alert"
        class="mb-4"
      />

      <UForm
        :state="form"
        :validate="validate"
        class="space-y-4"
        @submit="submit"
      >
        <UFormField
          name="title"
          label="Event title"
        >
          <UInput
            v-model="form.title"
            size="xl"
            placeholder="Summer Concert 2025"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="description"
          label="Description"
        >
          <UTextarea
            v-model="form.description"
            size="xl"
            :rows="4"
            placeholder="Optional description"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            variant="ghost"
            color="neutral"
            type="button"
            @click="$emit('update:open', false)"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="saving"
          >
            {{ event ? 'Save changes' : 'Create event' }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { apiCreateEvent, apiUpdateEvent } from '~/api/events.api'

const props = defineProps({
  open: Boolean,
  event: { type: Object, default: null }
})

const emit = defineEmits(['update:open', 'saved'])

const form = reactive({ title: '', description: '' })
const saving = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
  if (val) {
    form.title = props.event?.title || ''
    form.description = props.event?.description || ''
    error.value = ''
  }
})

function validate(data) {
  const errors = []
  if (!data.title) errors.push({ name: 'title', message: 'Event title is required' })
  return errors
}

async function submit() {
  saving.value = true
  error.value = ''
  try {
    if (props.event) {
      await apiUpdateEvent(props.event.id, form)
    } else {
      await apiCreateEvent(form)
    }
    emit('update:open', false)
    emit('saved')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to save event.'
  } finally {
    saving.value = false
  }
}
</script>
