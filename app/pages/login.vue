<script setup lang="ts">
import { apiLogin, type LoginPayload, type ApiValidationError } from '~/utils/api'

definePageMeta({ layout: 'auth' })

useSeoMeta({ title: 'Sign In — TicketScan' })

const state = reactive<LoginPayload>({
  email: '',
  password: ''
})

const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()
const { token: authToken, userName: authUserName } = useAuth()

type FormError = { name: string; message: string }

function validate(data: LoginPayload): FormError[] {
  const errors: FormError[] = []
  if (!data.email) errors.push({ name: 'email', message: 'Email is required' })
  if (!data.password) errors.push({ name: 'password', message: 'Password is required' })
  return errors
}

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiLogin(state)
    authToken.value = response.token
    authUserName.value = response.user.name
    await router.push('/')
  } catch (err: unknown) {
    const apiErr = err as { data?: ApiValidationError }
    errorMessage.value = apiErr?.data?.message || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <div class="text-center">
        <h1 class="text-xl font-semibold text-highlighted">
          Sign in to your account
        </h1>
        <p class="mt-1 text-sm text-muted">
          Welcome back
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
      <UFormField name="email" label="Email address">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password" label="Password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        block
        class="mt-2"
      >
        Sign in
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-muted">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="font-medium text-primary hover:underline"
        >
          Create one
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>