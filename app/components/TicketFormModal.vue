<template>
  <UModal
    :open="open"
    :title="ticket ? 'Edit ticket' : 'Add ticket'"
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
          name="code"
          label="Code"
        >
          <UInput
            v-model="form.code"
            size="xl"
            placeholder="TICKET-001"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="name"
          label="Name"
        >
          <UInput
            v-model="form.name"
            size="xl"
            placeholder="John Doe"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField
            name="seat"
            label="Seat"
          >
            <UInput
              v-model="form.seat"
              size="xl"
              placeholder="A12"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="category"
            label="Category"
          >
            <UInput
              v-model="form.category"
              size="xl"
              placeholder="VIP"
              class="w-full"
            />
          </UFormField>
        </div>

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
            {{ ticket ? 'Save changes' : 'Add ticket' }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { apiCreateTicket, apiUpdateTicket } from '~/api/tickets.api'

const props = defineProps({
  open: Boolean,
  eventId: { type: [String, Number], required: true },
  ticket: { type: Object, default: null }
})

const emit = defineEmits(['update:open', 'saved'])

const form = reactive({ code: '', name: '', seat: '', category: '' })
const saving = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
  if (val) {
    form.code = props.ticket?.code || ''
    form.name = props.ticket?.name || ''
    form.seat = props.ticket?.seat || ''
    form.category = props.ticket?.category || ''
    error.value = ''
  }
})

function validate(data) {
  const errors = []
  if (!data.code) errors.push({ name: 'code', message: 'Code is required' })
  return errors
}

async function submit() {
  saving.value = true
  error.value = ''
  try {
    if (props.ticket) {
      await apiUpdateTicket(props.eventId, props.ticket.id, form)
    } else {
      await apiCreateTicket(props.eventId, form)
    }
    emit('update:open', false)
    emit('saved')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to save ticket.'
  } finally {
    saving.value = false
  }
}
</script>
