<template>
  <div class="min-h-screen flex flex-col">
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-12 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UDropdownMenu
          v-if="isLoggedIn"
          :items="userMenuItems"
          :content="{ align: 'end' }"
        >
          <UButton
            v-if="user"
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
          >
            {{ user.email }}
          </UButton>
        </UDropdownMenu>

        <UButton
          v-else
          to="/login"
          color="neutral"
          variant="ghost"
          leading-icon="i-lucide-log-in"
        >
          Sign in
        </UButton>
      </template>
    </UHeader>

    <UMain class="flex-1">
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>

<script setup>
const { isLoggedIn, user, logout } = useAuth()

const colorMode = useColorMode()

const userMenuItems = computed(() => [[
  {
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onSelect: logout
  }
]])
</script>
