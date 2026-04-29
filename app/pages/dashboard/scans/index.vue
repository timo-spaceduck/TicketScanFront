<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Scan Logs
      </h1>
      <p class="text-sm text-muted mt-0.5">
        History of all validated tickets
      </p>
    </div>

    <UAlert
      v-if="pageError"
      color="error"
      variant="soft"
      :description="pageError"
      icon="i-lucide-circle-alert"
      class="mb-4"
    />

    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="scans.length === 0"
      class="flex flex-col items-center py-16 text-center"
    >
      <UIcon
        name="i-lucide-history"
        class="size-12 mb-3 text-muted"
      />
      <p class="text-muted text-sm">
        No scan logs yet.
      </p>
    </div>

    <template v-else>
      <div class="border border-default rounded-lg overflow-x-auto">
        <UTable
          :data="scans"
          :columns="columns"
        >
          <template #scanned_at-cell="{ row }">
            {{ formatDate(row.getValue('created_at')) }}
          </template>
          <template #actions-cell="{ row }">
            <div class="flex justify-end">
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-lucide-trash-2"
                @click="openDeleteModal(row.original)"
              />
            </div>
          </template>
        </UTable>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex justify-center mt-5"
      >
        <UPagination
          v-model:page="page"
          :total="total"
          :items-per-page="perPage"
        />
      </div>
    </template>

    <ScanDeleteModal
      v-model:open="isDeleteModalOpen"
      :scan="deletingScan"
      @deleted="fetchScans"
    />
  </div>
</template>

<script setup>
import { apiGetScans } from '~/api/scans.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Scan Logs — TicketScan' })

const scans = ref([])
const loading = ref(false)
const pageError = ref('')
const page = ref(1)
const perPage = 20
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / perPage))

const isDeleteModalOpen = ref(false)
const deletingScan = ref(null)

const columns = [
  { accessorKey: 'code', header: 'Ticket code' },
  { accessorKey: 'show.title', header: 'Event' },
  { accessorKey: 'created_at', header: 'Scanned at' },
  { id: 'actions', header: '' }
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

async function fetchScans() {
  loading.value = true
  pageError.value = ''
  try {
    const res = await apiGetScans(page.value, perPage)
    const items = Array.isArray(res) ? res : (res.data ?? [])
    scans.value = items
    total.value = res.total ?? res.meta?.total ?? items.length
  } catch {
    pageError.value = 'Failed to load scan logs.'
  } finally {
    loading.value = false
  }
}

watch(page, fetchScans)

function openDeleteModal(scan) {
  deletingScan.value = scan
  isDeleteModalOpen.value = true
}

onMounted(fetchScans)
</script>
