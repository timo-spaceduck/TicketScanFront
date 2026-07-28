<template>
  <footer class="border-t border-default mt-auto">
    <div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2"
      >
        <AppLogo class="h-6 w-auto shrink-0" />
        <span class="app-wordmark text-sm">Ticket<strong>Scan</strong></span>
      </NuxtLink>

      <nav class="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
        <NuxtLink
          to="/pricing"
          class="hover:text-highlighted transition-colors"
        >
          Pricing
        </NuxtLink>
        <NuxtLink
          to="/privacy"
          class="hover:text-highlighted transition-colors"
        >
          Privacy Policy
        </NuxtLink>
        <NuxtLink
          to="/terms"
          class="hover:text-highlighted transition-colors"
        >
          Terms of Service
        </NuxtLink>
        <NuxtLink
          to="/refund-policy"
          class="hover:text-highlighted transition-colors"
        >
          Refund Policy
        </NuxtLink>
      </nav>

      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} TicketScan
      </p>
    </div>
  </footer>
</template>
