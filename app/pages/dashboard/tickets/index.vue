<template>
  <div class="p-4 sm:p-8 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Tickets
      </h1>
      <p class="text-sm text-muted mt-0.5">
        Upload a ticket list for an event
      </p>
    </div>

    <UCard>
      <TicketUploadForm />
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Tickets — TicketScan' })
</script>
