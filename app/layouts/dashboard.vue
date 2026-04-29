<template>
  <div class="flex h-screen bg-default overflow-hidden">
    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/40 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-30 w-64 flex flex-col border-r border-default bg-default transition-transform duration-200
             lg:static lg:translate-x-0 lg:z-auto lg:shrink-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between px-5 h-16 border-b border-default shrink-0">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5">
          <AppLogo class="h-9 w-auto shrink-0" />
          <span class="app-wordmark">Ticket<strong>Scan</strong></span>
        </NuxtLink>
        <UButton
          class="lg:hidden"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          size="sm"
          @click="sidebarOpen = false"
        />
      </div>

      <nav class="flex-1 overflow-y-auto p-3 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:text-highlighted hover:bg-elevated'"
          @click="sidebarOpen = false"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
          {{ item.label }}
        </NuxtLink>

<!--        <a-->
<!--          href="/scanner"-->
<!--          target="_blank"-->
<!--          rel="noopener"-->
<!--          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-muted hover:text-highlighted hover:bg-elevated"-->
<!--          @click="sidebarOpen = false"-->
<!--        >-->
<!--          <UIcon name="i-lucide-scan-line" class="size-5 shrink-0" />-->
<!--          Scanner-->
<!--          <UIcon name="i-lucide-external-link" class="size-3.5 ml-auto text-muted/60" />-->
<!--        </a>-->
      </nav>

      <div class="p-3 border-t border-default space-y-1 shrink-0">
        <div class="px-3 py-1.5 text-xs text-muted truncate">
          {{ user?.email }}
        </div>
        <div class="flex items-center gap-1">
          <UButton
            variant="ghost"
            color="neutral"
            leading-icon="i-lucide-log-out"
            class="flex-1 justify-start"
            size="sm"
            @click="logout"
          >
            Sign out
          </UButton>
          <UButton
            variant="ghost"
            color="neutral"
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            size="sm"
            @click="toggleColorMode"
          />
        </div>
      </div>
    </aside>

    <!-- Content -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Mobile top bar -->
      <header class="flex items-center gap-3 px-4 h-14 border-b border-default shrink-0 lg:hidden">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-menu"
          size="sm"
          @click="sidebarOpen = true"
        />
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <AppLogo class="h-8 w-auto shrink-0" />
          <span class="app-wordmark">Ticket<strong>Scan</strong></span>
        </NuxtLink>
      </header>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()
const route = useRoute()
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const sidebarOpen = ref(false)

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/events', label: 'Events', icon: 'i-lucide-calendar' },
  { to: '/dashboard/tickets', label: 'Tickets', icon: 'i-lucide-ticket' },
  { to: '/dashboard/scans', label: 'Scan Logs', icon: 'i-lucide-history' },
  { to: '/scanner', label: 'Scanner', icon: 'i-lucide-scan-line' }
]

function isActive(path) {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
