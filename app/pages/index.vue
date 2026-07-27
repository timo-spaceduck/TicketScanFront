<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-20">
    <AppLogo class="h-20 w-auto mb-8" />

    <h1 class="text-4xl font-bold text-highlighted text-center max-w-xl leading-tight">
      Scan tickets, manage events, run shows.
    </h1>
    <p class="mt-4 text-lg text-muted text-center max-w-lg">
      TicketScan is web-based event ticket management and QR code scanning software - import your ticket list,
      check attendees in at the door, and track every scan in real time. No app download required.
    </p>

    <div class="mt-10 flex gap-3 flex-wrap justify-center">
      <UButton
        to="/login"
        size="xl"
        leading-icon="i-lucide-log-in"
      >
        Sign in
      </UButton>
      <UButton
        to="/register"
        size="xl"
        variant="outline"
        color="neutral"
      >
        Create account
      </UButton>
    </div>

    <div class="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col items-center text-center"
      >
        <div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 mb-4">
          <UIcon
            :name="feature.icon"
            class="size-6 text-primary"
          />
        </div>
        <h3 class="font-semibold text-highlighted">
          {{ feature.title }}
        </h3>
        <p class="mt-1 text-sm text-muted">
          {{ feature.description }}
        </p>
      </div>
    </div>

    <div class="mt-24 w-full max-w-3xl rounded-2xl border border-default bg-elevated/50 p-8 sm:p-10">
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 mb-4">
          <UIcon
            name="i-lucide-globe"
            class="size-6 text-primary"
          />
        </div>
        <h2 class="text-2xl font-bold text-highlighted">
          100% web-based - no app to download
        </h2>
        <p class="mt-2 text-muted max-w-xl">
          TicketScan runs entirely in the browser, so there's nothing to install and nothing to update.
          Sign in on any laptop, tablet, or phone and start scanning tickets in seconds.
        </p>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <div
          v-for="point in webPoints"
          :key="point"
          class="flex items-start gap-2.5 text-sm text-muted"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="size-4 text-primary mt-0.5 shrink-0"
          />
          {{ point }}
        </div>
      </div>
    </div>

    <div class="mt-24 w-full max-w-4xl">
      <h2 class="text-2xl font-bold text-highlighted text-center">
        Pricing
      </h2>
      <p class="mt-2 text-sm text-muted text-center">
        Simple plans that grow with your events.
      </p>

      <UAlert
        v-if="tariffsError"
        color="error"
        variant="soft"
        :description="tariffsError"
        icon="i-lucide-circle-alert"
        class="mt-8"
      />

      <div
        v-if="tariffsLoading"
        class="flex justify-center py-16"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-8 animate-spin text-muted"
        />
      </div>

      <TariffPricingGrid
        v-else
        :tariffs="tariffs || []"
        class="mt-8"
        @subscribe="goToRegister"
      />
    </div>

    <FaqSection class="mt-24" />
  </div>
</template>

<script setup>
const description = 'TicketScan is web-based event ticket management and QR code scanning software. '
  + 'Import ticket lists, check attendees in at the door, and track scans in real time - no app download required.'

useSeoMeta({
  title: 'TicketScan - Web-Based Event Ticket Scanning & Management',
  description,
  ogTitle: 'TicketScan - Web-Based Event Ticket Scanning & Management',
  ogDescription: description,
  ogType: 'website',
  ogImage: '/web-app-manifest-512x512.png',
  twitterCard: 'summary',
  twitterTitle: 'TicketScan - Web-Based Event Ticket Scanning & Management',
  twitterDescription: description
})

useHead({
  meta: [
    { name: 'keywords', content: 'ticket scanning app, event ticket management, QR code ticket scanner, web-based check-in software, box office software, no app download, event check-in' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'TicketScan',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web browser (no installation required)',
        description,
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      })
    }
  ]
})

const { isLoggedIn } = useAuth()

if (isLoggedIn.value) {
  await navigateTo('/dashboard/events')
}

const { tariffs, loading: tariffsLoading, error: tariffsError, fetchTariffs } = useTariffs()

onMounted(() => {
  fetchTariffs()
})

function goToRegister() {
  navigateTo('/register')
}

const features = [
  {
    icon: 'i-lucide-calendar',
    title: 'Manage Events',
    description: 'Create and organize all your events in one place.'
  },
  {
    icon: 'i-lucide-file-spreadsheet',
    title: 'Import Tickets',
    description: 'Upload your ticket lists via Excel or CSV files instantly.'
  },
  {
    icon: 'i-lucide-scan-line',
    title: 'Scan at the Door',
    description: 'Fast and reliable ticket scanning for any venue size.'
  }
]

const webPoints = [
  'No App Store or Play Store download - nothing to install',
  'Works in any modern browser on desktop, iOS, and Android',
  'Uses your device camera to scan QR codes, right from the browser',
  'Updates roll out automatically - always the latest version',
  'Sign in from as many devices as you need at the door',
  'No storage taken up on staff phones or scanning devices'
]
</script>
