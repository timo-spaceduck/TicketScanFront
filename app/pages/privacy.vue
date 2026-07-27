<template>
  <div class="px-4 py-16 sm:py-20">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-highlighted">
        Privacy Policy
      </h1>
      <p class="mt-2 text-sm text-muted">
        Last updated: {{ lastUpdated }}
      </p>

      <div class="mt-10 space-y-8">
        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            1. Introduction
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            TicketScan ("we", "us", "our") provides software for managing events, importing
            ticket lists, and scanning tickets at the door. This Privacy Policy explains what
            information we collect, how we use it, and the choices you have.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            2. Information We Collect
          </h2>
          <ul class="mt-2 space-y-2 text-sm text-muted leading-relaxed list-disc list-inside">
            <li><strong class="text-default">Account information</strong> - your email address and password when you register.</li>
            <li><strong class="text-default">Event and ticket data</strong> - events you create and ticket lists you upload (e.g. via Excel/CSV), including any attendee information contained in those files.</li>
            <li><strong class="text-default">Scan logs</strong> - records of ticket scans performed at your events, including timestamps and scan results.</li>
            <li><strong class="text-default">Billing information</strong> - subscription plan and payment status. Payments are processed by Paddle, our payment provider; we do not store your card details.</li>
            <li><strong class="text-default">Usage data</strong> - basic technical information such as browser type and IP address, used for security and troubleshooting.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            3. How We Use Information
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We use the information we collect to operate and improve TicketScan, to provide
            customer support, to process payments and manage subscriptions, and to keep the
            service secure. We do not sell your personal information.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            4. Data Sharing
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We share data only with service providers that help us run TicketScan, such as
            hosting infrastructure and Paddle for payment processing. These providers are only
            permitted to use your data to perform services on our behalf.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            5. Data Retention
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We retain account, event, ticket, and scan data for as long as your account is
            active. You may request deletion of your account and associated data at any time
            by contacting us.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            6. Your Rights
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            Depending on your location, you may have the right to access, correct, export, or
            delete your personal information. To exercise these rights, contact us using the
            details below.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            7. Security
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We use reasonable technical and organizational measures to protect your data.
            However, no method of transmission or storage is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            8. Changes to This Policy
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We may update this Privacy Policy from time to time. We will update the "Last
            updated" date above when changes are made.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            9. Contact Us
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            If you have questions about this Privacy Policy, contact us at
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
useSeoMeta({ title: 'Privacy Policy - TicketScan' })

const lastUpdated = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>
