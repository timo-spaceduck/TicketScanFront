<template>
  <UApp>
    <div class="min-h-screen flex flex-col items-center justify-center bg-default px-4">
      <NuxtLink to="/" class="mb-8">
        <AppLogo class="h-8 w-auto" />
      </NuxtLink>

      <slot />

      <p class="mt-8 text-sm text-muted">
        © {{ new Date().getFullYear() }} TicketScan
      </p>
    </div>
  </UApp>
</template>