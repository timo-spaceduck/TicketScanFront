<template>
  <div class="min-h-screen flex flex-col">
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <AppLogo class="w-auto h-12 shrink-0" />
          <span class="hidden md:inline app-wordmark text-sm">Ticket<strong>Scan</strong></span>
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

const userMenuItems = computed(() => [
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/dashboard'
    }
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: logout
    }
  ]
])
</script>
