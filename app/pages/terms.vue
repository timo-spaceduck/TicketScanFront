<template>
  <div class="px-4 py-16 sm:py-20">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-highlighted">
        Terms of Service
      </h1>
      <p class="mt-2 text-sm text-muted">
        Last updated: {{ lastUpdated }}
      </p>

      <div class="mt-10 space-y-8">
        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            1. Agreement to Terms
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of TicketScan (the
            "Service"). By creating an account or using the Service, you agree to be bound by
            these Terms.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            2. The Service
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            TicketScan lets you create events, import ticket lists, and scan tickets at the
            door. Features and available tariff plans may change over time.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            3. Accounts
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            You are responsible for maintaining the security of your account credentials and
            for all activity that occurs under your account. You must provide accurate
            information when registering.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            4. Subscriptions and Payment
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            Some features require a paid subscription (tariff plan). Payments are processed by
            our payment provider, Paddle. Plan limits (such as the number of events or tickets)
            apply as described on the pricing page. Fees are non-refundable except as required
            by law or as stated at the time of purchase.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            5. Acceptable Use
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            You agree not to misuse the Service, including by attempting to disrupt it, access
            it using unauthorized means, or upload content you do not have the right to use.
            You are responsible for the accuracy of the event and ticket data you upload.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            6. Your Data
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            You retain ownership of the event, ticket, and attendee data you upload to the
            Service. You are responsible for ensuring you have the necessary rights and
            permissions to upload and process that data. See our
            <NuxtLink
              to="/privacy"
              class="text-primary hover:underline"
            >Privacy Policy</NuxtLink>
            for details on how we handle your data.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            7. Termination
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            You may stop using the Service at any time. We may suspend or terminate access to
            the Service if these Terms are violated or if required to protect the Service or
            other users.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            8. Disclaimers and Limitation of Liability
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            The Service is provided "as is" without warranties of any kind. To the maximum
            extent permitted by law, TicketScan will not be liable for indirect, incidental, or
            consequential damages arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            9. Changes to These Terms
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We may update these Terms from time to time. Continued use of the Service after
            changes take effect constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            10. Contact Us
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            If you have questions about these Terms, contact us at
            <a
              :href="`mailto:${SUPPORT_EMAIL}`"
              class="text-primary hover:underline"
            >{{ SUPPORT_EMAIL }}</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: 'Terms of Service — TicketScan' })

const lastUpdated = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>
