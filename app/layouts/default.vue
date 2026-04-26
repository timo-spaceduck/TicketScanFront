<script setup lang="ts">
const { isLoggedIn, userName, logout } = useAuth()

const userMenuItems = computed(() => [[
  {
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onSelect: logout
  }
]])
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
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
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
          >
            {{ userName }}
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

    <UMain>
      <slot />
    </UMain>
  </div>
</template>