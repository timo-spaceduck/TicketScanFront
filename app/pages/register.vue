<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <div class="text-center">
        <h1 class="text-xl font-semibold text-highlighted">
          Create your account
        </h1>
        <p class="mt-1 text-sm text-muted">
          Start scanning tickets today
        </p>
      </div>
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
<!--      <UFormField name="name" label="Full name">-->
<!--        <UInput-->
<!--          v-model="state.name"-->
<!--          type="text"-->
<!--          size="xl"-->
<!--          placeholder="Jane Smith"-->
<!--          autocomplete="name"-->
<!--          class="w-full"-->
<!--        />-->
<!--      </UFormField>-->

      <UFormField name="email" label="Email address">
        <UInput
          v-model="state.email"
          type="email"
          size="xl"
          placeholder="you@example.com"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password" label="Password">
        <UInput
          v-model="state.password"
          type="password"
          size="xl"
          placeholder="Min. 8 characters"
          autocomplete="new-password"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password_confirmation" label="Confirm password">
        <UInput
          v-model="state.password_confirmation"
          type="password"
          size="xl"
          placeholder="••••••••"
          autocomplete="new-password"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        block
        size="xl"
        class="mt-2"
      >
        Create account
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-muted">
        Already have an account?
        <NuxtLink
          to="/login"
          class="font-medium text-primary hover:underline"
        >
          Sign in
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>

<script setup>
import { apiRegister } from '~/utils/api'

definePageMeta({ layout: 'auth' })

useSeoMeta({ title: 'Create Account — TicketScan' })

const state = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()
const { token: authToken, userName: authUserName } = useAuth()

function validate(data) {
  const errors = []
  // if (!data.name) errors.push({ name: 'name', message: 'Name is required' })
  if (!data.email) errors.push({ name: 'email', message: 'Email is required' })
  if (!data.password) errors.push({ name: 'password', message: 'Password is required' })
  else if (data.password.length < 8) errors.push({ name: 'password', message: 'Password must be at least 8 characters' })
  if (!data.password_confirmation) errors.push({ name: 'password_confirmation', message: 'Please confirm your password' })
  else if (data.password !== data.password_confirmation) errors.push({ name: 'password_confirmation', message: 'Passwords do not match' })
  return errors
}

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiRegister({
      // name: state.name,
      email: state.email,
      password: state.password,
      password_confirmation: state.password_confirmation
    })
    authToken.value = response.token
    authUserName.value = response.user.name
    await router.push('/')
  } catch (err) {
    const serverData = err?.response?.data
    const firstFieldError = serverData?.errors
      ? Object.values(serverData.errors)[0]?.[0]
      : undefined
    errorMessage.value = firstFieldError || serverData?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
