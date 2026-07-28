<template>
  <div class="px-4 py-16 sm:py-20">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-highlighted">
        Refund Policy
      </h1>
      <p class="mt-2 text-sm text-muted">
        Last updated: {{ lastUpdated }}
      </p>

      <div class="mt-10 space-y-8">
        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            1. Overview
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            This Refund Policy explains how refunds are handled for paid subscriptions
            (tariff plans) purchased through TicketScan. Payments are processed by our payment
            provider, Paddle, who acts as the merchant of record for your purchase.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            2. Subscription Billing
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            Paid tariff plans renew automatically at the end of each billing period unless
            cancelled beforehand. You can cancel at any time from your billing settings - your
            plan will remain active until the end of the period you've already paid for, and
            will not renew after that.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            3. General Refund Policy
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            Subscription fees are generally non-refundable, including for partially used
            billing periods. When you cancel, you keep access to your plan until it expires
            instead of receiving a prorated refund. This helps keep pricing simple and
            predictable for everyone.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            4. Exceptions
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We may issue a refund at our discretion in cases such as a duplicate or accidental
            charge, a billing error on our part, or where required by applicable consumer
            protection law. Contact us and we'll review your request.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            5. How to Request a Refund
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            To request a refund, email us at
            <a
              :href="`mailto:${SUPPORT_EMAIL}`"
              class="text-primary hover:underline"
            >{{ SUPPORT_EMAIL }}</a>
            with your account email and the reason for your request. We aim to respond within
            a few business days.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            6. Chargebacks
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            Please contact us before filing a chargeback with your bank or card provider - most
            billing issues can be resolved directly and more quickly this way. Accounts with
            open chargebacks may be suspended while the dispute is investigated.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            7. Changes to This Policy
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            We may update this Refund Policy from time to time. We will update the "Last
            updated" date above when changes are made.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-highlighted">
            8. Contact Us
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            If you have questions about this Refund Policy, contact us at
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
useSeoMeta({ title: 'Refund Policy - TicketScan' })

const lastUpdated = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>
