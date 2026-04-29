<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">
          Tickets
        </h1>
        <p class="text-sm text-muted mt-0.5">
          Manage tickets for your events
        </p>
      </div>
      <UButton
        v-if="selectedEventId"
        leading-icon="i-lucide-plus"
        @click="openAddModal"
      >
        Add ticket
      </UButton>
    </div>

    <div
      v-if="selectedEventId"
      class="mb-5"
    >
      <USelect
        v-model="selectedEventId"
        :items="eventOptions"
        placeholder="Select an event…"
        size="lg"
      />
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
      v-if="!selectedEventId"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div class="border border-default rounded-xl p-6 flex flex-col gap-4">
        <div class="flex flex-col items-center text-center gap-2">
          <UIcon
            name="i-lucide-ticket"
            class="size-10 text-primary"
          />
          <p class="font-semibold text-highlighted">
            Browse tickets
          </p>
          <p class="text-sm text-muted">
            Select an event to view and manage its tickets
          </p>
        </div>
        <USelect
          v-model="selectedEventId"
          :items="eventOptions"
          placeholder="Select an event…"
          size="lg"
        />
      </div>

      <div class="border border-default rounded-xl p-6 flex flex-col items-center text-center gap-4">
        <UIcon
          name="i-lucide-upload"
          class="size-10 text-primary"
        />
        <div>
          <p class="font-semibold text-highlighted">
            Upload tickets
          </p>
          <p class="text-sm text-muted">
            Import tickets from a CSV or Excel file
          </p>
        </div>
        <UButton
          variant="soft"
          leading-icon="i-lucide-upload"
          class="w-full justify-center"
          @click="isUploadModalOpen = true"
        >
          Upload file
        </UButton>
      </div>
    </div>

    <div
      v-else-if="loading"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="tickets.length === 0"
      class="flex flex-col items-center py-16 text-center"
    >
      <UIcon
        name="i-lucide-ticket"
        class="size-12 mb-3 text-muted"
      />
      <p class="text-muted text-sm mb-4">
        No tickets for this event yet.
      </p>
      <UButton
        leading-icon="i-lucide-plus"
        @click="openAddModal"
      >
        Add ticket
      </UButton>
    </div>

    <template v-else>
      <div class="border border-default rounded-lg overflow-x-auto">
        <UTable
          :data="tickets"
          :columns="columns"
        >
          <template #actions-cell="{ row }">
            <div class="flex justify-end">
              <UDropdownMenu :items="getActionItems(row.original)">
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-ellipsis-vertical"
                />
              </UDropdownMenu>
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

    <TicketFormModal
      v-model:open="isFormModalOpen"
      :event-id="selectedEventId"
      :ticket="editingTicket"
      @saved="fetchTickets"
    />

    <TicketDeleteModal
      v-model:open="isDeleteModalOpen"
      :event-id="selectedEventId"
      :ticket="deletingTicket"
      @deleted="fetchTickets"
    />

    <TicketUploadModal
      v-model:open="isUploadModalOpen"
    />
  </div>
</template>

<script setup>
import { apiGetEvents } from '~/api/events.api'
import { apiGetTickets } from '~/api/tickets.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Tickets — TicketScan' })

const events = ref([])
const selectedEventId = ref(null)

const tickets = ref([])
const loading = ref(false)
const pageError = ref('')
const page = ref(1)
const perPage = 20
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / perPage))

const isFormModalOpen = ref(false)
const editingTicket = ref(null)
const isDeleteModalOpen = ref(false)
const deletingTicket = ref(null)
const isUploadModalOpen = ref(false)

const eventOptions = computed(() =>
  events.value.map(e => ({ label: e.title, value: e.id }))
)

const columns = [
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'seat', header: 'Seat' },
  { accessorKey: 'category', header: 'Category' },
  { id: 'actions', header: '' }
]

function getActionItems(ticket) {
  return [
    [
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEditModal(ticket) }
    ],
    [
      { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => openDeleteModal(ticket) }
    ]
  ]
}

async function fetchTickets() {
  if (!selectedEventId.value) return
  loading.value = true
  pageError.value = ''
  try {
    const res = await apiGetTickets(selectedEventId.value, page.value, perPage)
    const items = Array.isArray(res) ? res : (res.data ?? [])
    tickets.value = items
    total.value = res.total ?? res.meta?.total ?? items.length
  } catch {
    pageError.value = 'Failed to load tickets.'
  } finally {
    loading.value = false
  }
}

watch(selectedEventId, () => {
  page.value = 1
  fetchTickets()
})

watch(page, fetchTickets)

function openAddModal() {
  editingTicket.value = null
  isFormModalOpen.value = true
}

function openEditModal(ticket) {
  editingTicket.value = ticket
  isFormModalOpen.value = true
}

function openDeleteModal(ticket) {
  deletingTicket.value = ticket
  isDeleteModalOpen.value = true
}

onMounted(async () => {
  try {
    events.value = await apiGetEvents()
  } catch {
    pageError.value = 'Failed to load events.'
  }
})
</script>
