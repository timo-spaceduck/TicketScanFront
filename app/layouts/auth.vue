<template>
  <UApp>
    <div class="min-h-screen flex flex-col items-center justify-center bg-default px-4">
      <NuxtLink to="/" class="flex items-center gap-3 mb-8">
        <AppLogo class="h-14 w-auto shrink-0" />
        <span class="app-wordmark" style="font-size: 1.4rem;">Ticket<strong>Scan</strong></span>
      </NuxtLink>

      <slot />

      <p class="mt-8 text-sm text-muted">
        © {{ new Date().getFullYear() }} TicketScan
      </p>
    </div>
  </UApp>
</template>
