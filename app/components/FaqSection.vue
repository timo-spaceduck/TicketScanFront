<template>
  <div class="w-full max-w-2xl">
    <h2 class="text-2xl font-bold text-highlighted text-center">
      Frequently asked questions
    </h2>
    <p class="mt-2 text-sm text-muted text-center">
      Everything you need to know about scanning tickets with TicketScan.
    </p>

    <UAccordion
      :items="faqs"
      class="mt-8"
    />
  </div>
</template>

<script setup>
const faqs = [
  {
    label: 'Do I need to download an app to scan tickets?',
    content: 'No. TicketScan runs entirely in your web browser — open the scanner page on any phone, tablet, or laptop, allow camera access, and start scanning. There\'s nothing to download from the App Store or Play Store.'
  },
  {
    label: 'What devices and browsers are supported?',
    content: 'Any modern browser (Chrome, Safari, Firefox, or Edge) on desktop, iOS, or Android works. For scanning, your device just needs a camera and browser permission to use it.'
  },
  {
    label: 'How do I import my ticket list?',
    content: 'Upload your attendee or ticket list as an Excel or CSV file from the dashboard, and TicketScan generates scannable tickets automatically.'
  },
  {
    label: 'Can multiple staff scan tickets at the same event?',
    content: 'Yes. Anyone signed in to your account can open the scanner from their own device\'s browser and scan at the same time — no extra hardware or app installs needed.'
  },
  {
    label: 'What happens if I exceed my plan\'s event or ticket limit?',
    content: 'You can upgrade to a higher tariff plan at any time from the billing page to raise your event and ticket limits.'
  },
  {
    label: 'How is billing handled?',
    content: 'Subscriptions are processed securely through Paddle, our payment provider. See the pricing section above for current plans and limits.'
  }
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.label,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.content
          }
        }))
      })
    }
  ]
})
</script>
