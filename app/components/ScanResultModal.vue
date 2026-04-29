<template>
  <UModal :open="open" @update:open="$emit('update:open', $event)">
    <template #content>
      <div class="p-6 flex flex-col items-center gap-5">
        <div
          class="size-16 rounded-full flex items-center justify-center"
          :class="isAlreadyScanned ? 'bg-amber-500/15' : 'bg-emerald-500/15'"
        >
          <UIcon
            :name="isAlreadyScanned ? 'i-lucide-clock' : 'i-lucide-check-circle'"
            class="size-8"
            :class="isAlreadyScanned ? 'text-amber-500' : 'text-emerald-500'"
          />
        </div>

        <p class="text-lg font-bold text-highlighted">
          {{ isAlreadyScanned ? 'Already Scanned' : 'Valid Ticket' }}
        </p>

        <div class="w-full border border-default rounded-xl overflow-hidden divide-y divide-default text-sm">
          <div class="flex justify-between gap-4 px-4 py-3">
            <span class="text-muted shrink-0">Code</span>
            <span class="font-mono text-highlighted truncate">{{ ticket?.code }}</span>
          </div>
          <div
            v-if="ticket?.name"
            class="flex justify-between gap-4 px-4 py-3"
          >
            <span class="text-muted shrink-0">Name</span>
            <span class="text-highlighted truncate">{{ ticket.name }}</span>
          </div>
          <div
            v-if="ticket?.seat"
            class="flex justify-between gap-4 px-4 py-3"
          >
            <span class="text-muted shrink-0">Seat</span>
            <span class="text-highlighted">{{ ticket.seat }}</span>
          </div>
          <div
            v-if="ticket?.category"
            class="flex justify-between gap-4 px-4 py-3"
          >
            <span class="text-muted shrink-0">Category</span>
            <span class="text-highlighted">{{ ticket.category }}</span>
          </div>
        </div>

        <div
          v-if="isAlreadyScanned && ticket?.scans?.length"
          class="w-full"
        >
          <p class="text-xs text-muted font-medium uppercase tracking-wide mb-2">
            Scan history
          </p>
          <div class="border border-default rounded-xl overflow-hidden divide-y divide-default text-sm">
            <div
              v-for="(scan, i) in ticket.scans"
              :key="i"
              class="flex justify-between gap-4 px-4 py-3"
            >
              <span class="text-muted shrink-0">#{{ i + 1 }}</span>
              <span class="text-highlighted">{{ formatScanDate(scan.created_at) }}</span>
            </div>
          </div>
        </div>

        <UButton
          block
          size="lg"
          :color="isAlreadyScanned ? 'neutral' : 'primary'"
          @click="$emit('update:open', false)"
        >
          Continue
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  ticket: Object,
  status: String
})

defineEmits(['update:open'])

const isAlreadyScanned = computed(() => props.status === 'already_scanned')

function formatScanDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>
