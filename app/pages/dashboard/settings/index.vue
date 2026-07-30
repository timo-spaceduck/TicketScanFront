<template>
  <div class="p-4 sm:p-8 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Settings
      </h1>
      <p class="text-sm text-muted mt-0.5">
        Manage your account security
      </p>
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">
          Change password
        </h2>
      </template>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :description="errorMessage"
        icon="i-lucide-circle-alert"
        class="mb-4"
      />

      <UForm
        :state="state"
        :validate="validate"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField name="current_password" label="Current password">
          <UInput
            v-model="state.current_password"
            type="password"
            size="xl"
            placeholder="••••••••"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>

        <UFormField name="password" label="New password">
          <UInput
            v-model="state.password"
            type="password"
            size="xl"
            placeholder="Min. 8 characters"
            autocomplete="new-password"
            class="w-full"
          />
        </UFormField>

        <UFormField name="password_confirmation" label="Confirm new password">
          <UInput
            v-model="state.password_confirmation"
            type="password"
            size="xl"
            placeholder="••••••••"
            autocomplete="new-password"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end pt-2">
          <UButton
            type="submit"
            :loading="loading"
          >
            Update password
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>
import { apiChangePassword } from '~/api/auth.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Settings - TicketScan' })

const toast = useToast()

const state = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const errorMessage = ref('')
const loading = ref(false)

function validate(data) {
  const errors = []
  if (!data.current_password) errors.push({ name: 'current_password', message: 'Current password is required' })
  if (!data.password) errors.push({ name: 'password', message: 'New password is required' })
  else if (data.password.length < 8) errors.push({ name: 'password', message: 'Password must be at least 8 characters' })
  if (!data.password_confirmation) errors.push({ name: 'password_confirmation', message: 'Please confirm your new password' })
  else if (data.password !== data.password_confirmation) errors.push({ name: 'password_confirmation', message: 'Passwords do not match' })
  return errors
}

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    await apiChangePassword({
      current_password: state.current_password,
      password: state.password,
      password_confirmation: state.password_confirmation
    })
    state.current_password = ''
    state.password = ''
    state.password_confirmation = ''
    toast.add({
      title: 'Password updated',
      description: 'Your password has been changed successfully.',
      color: 'success'
    })
  } catch (err) {
    const serverData = err?.response?.data
    const firstFieldError = serverData?.errors
      ? Object.values(serverData.errors)[0]?.[0]
      : undefined
    errorMessage.value = firstFieldError || serverData?.message || 'Failed to update password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
