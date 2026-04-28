<template>
  <div class="flex h-screen bg-default overflow-hidden">
    <aside class="w-64 flex flex-col border-r border-default shrink-0">
      <div class="flex items-center px-5 h-16 border-b border-default">
        <NuxtLink to="/dashboard/events">
          <AppLogo class="h-9 w-auto" />
        </NuxtLink>
      </div>

      <nav class="flex-1 overflow-y-auto p-3 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:text-highlighted hover:bg-elevated'"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-3 border-t border-default space-y-1">
        <div class="px-3 py-1.5 text-xs text-muted truncate">
          {{ user?.email }}
        </div>
        <UButton
          variant="ghost"
          color="neutral"
          leading-icon="i-lucide-log-out"
          class="w-full justify-start"
          size="sm"
          @click="logout"
        >
          Sign out
        </UButton>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()
const route = useRoute()

const navItems = [
  { to: '/dashboard/events', label: 'Events', icon: 'i-lucide-calendar' },
  { to: '/dashboard/tickets', label: 'Tickets', icon: 'i-lucide-ticket' }
]

function isActive(path) {
  return route.path.startsWith(path)
}
</script>
