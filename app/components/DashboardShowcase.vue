<template>
  <div class="w-full max-w-4xl">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-highlighted">
        See TicketScan in action
      </h2>
      <p class="mt-2 text-sm text-muted max-w-lg mx-auto">
        A quick look at the dashboard your team will use to manage events, import tickets, and check people in.
      </p>
    </div>

    <div class="mt-8 flex flex-wrap justify-center gap-2">
      <UButton
        v-for="(tab, index) in tabs"
        :key="tab.label"
        :variant="activeIndex === index ? 'solid' : 'soft'"
        :color="activeIndex === index ? 'primary' : 'neutral'"
        size="sm"
        :icon="tab.icon"
        @click="activeIndex = index"
      >
        {{ tab.label }}
      </UButton>
    </div>

    <div class="mt-6 rounded-2xl border border-default bg-elevated/50 p-2 sm:p-3">
      <img
        :src="activeImage"
        :alt="activeTab.alt"
        class="w-full rounded-xl border border-default"
        width="1220"
        height="918"
      >
    </div>

    <p class="mt-4 text-sm text-muted text-center max-w-xl mx-auto">
      {{ activeTab.description }}
    </p>
  </div>
</template>

<script setup>
const tabs = [
  {
    label: 'Overview',
    icon: 'i-lucide-layout-dashboard',
    image: 'dashboard-overview',
    alt: 'TicketScan dashboard overview showing event, ticket, and validation counts',
    description: 'Check your event, ticket, and validation counts at a glance the moment you sign in.'
  },
  {
    label: 'Events',
    icon: 'i-lucide-calendar',
    image: 'dashboard-events',
    alt: 'TicketScan events list showing all created events',
    description: 'Create and organize every show or event you run in one central list.'
  },
  {
    label: 'Tickets',
    icon: 'i-lucide-file-spreadsheet',
    image: 'dashboard-tickets',
    alt: 'TicketScan tickets table showing imported attendee tickets',
    description: 'Browse imported tickets by event, complete with seat and category details, or upload a new list in seconds.'
  },
  {
    label: 'Scan Logs',
    icon: 'i-lucide-history',
    image: 'dashboard-scan-logs',
    alt: 'TicketScan scan logs showing a history of validated tickets',
    description: 'Track every validated ticket with a full history of what was scanned and when.'
  },
  {
    label: 'Scanner',
    icon: 'i-lucide-scan-line',
    image: 'dashboard-scanner',
    alt: 'TicketScan scanner event picker before starting a check-in session',
    description: 'Pick an event and start scanning tickets at the door from any device with a camera.'
  }
]

const activeIndex = ref(0)
const activeTab = computed(() => tabs[activeIndex.value])

const colorMode = useColorMode()
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const activeImage = computed(() => {
  const mode = mounted.value && colorMode.value === 'dark' ? 'dark' : 'light'
  return `/screenshots/${activeTab.value.image}-${mode}.webp`
})
</script>
