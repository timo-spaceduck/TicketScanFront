<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">
          Events
        </h1>
        <p class="text-sm text-muted mt-0.5">
          Create and manage your events
        </p>
      </div>
      <UButton
        leading-icon="i-lucide-plus"
        @click="openCreateModal"
      >
        New event
      </UButton>
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
      v-else-if="events.length === 0"
      class="flex flex-col items-center py-16 text-center"
    >
      <UIcon
        name="i-lucide-calendar-x"
        class="size-12 mb-3 text-muted"
      />
      <p class="text-muted text-sm">
        No events yet. Create your first one.
      </p>
    </div>

    <div
      v-else
      class="overflow-x-auto border border-default rounded-lg"
    >
      <UTable
        :data="events"
        :columns="columns"
      >
        <template #created_at-cell="{ row }">
          {{ formatDate(row.getValue('created_at')) }}
        </template>
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

    <EventFormModal
      v-model:open="isFormModalOpen"
      :event="editingEvent"
      @saved="fetchEvents"
    />

    <EventDeleteModal
      v-model:open="isDeleteModalOpen"
      :event="deletingEvent"
      @deleted="fetchEvents"
    />

    <TicketUploadModal
      v-model:open="isUploadModalOpen"
      :event="uploadingForEvent"
    />

    <ScansDeleteModal
      v-model:open="isScansDeleteModalOpen"
      :event="scansDeleteEvent"
    />
  </div>
</template>

<script setup>
import { apiGetEvents } from '~/api/events.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const router = useRouter()
useSeoMeta({ title: 'Events — TicketScan' })

const events = ref([])
const loading = ref(true)
const pageError = ref('')

const isFormModalOpen = ref(false)
const editingEvent = ref(null)

const isDeleteModalOpen = ref(false)
const deletingEvent = ref(null)

const isUploadModalOpen = ref(false)
const uploadingForEvent = ref(null)

const isScansDeleteModalOpen = ref(false)
const scansDeleteEvent = ref(null)

const columns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'created_at', header: 'Date added' },
  { id: 'actions', header: '' }
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchEvents() {
  loading.value = true
  pageError.value = ''
  try {
    events.value = await apiGetEvents()
  } catch {
    pageError.value = 'Failed to load events.'
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingEvent.value = null
  isFormModalOpen.value = true
}

function openEditModal(event) {
  editingEvent.value = event
  isFormModalOpen.value = true
}

function openDeleteModal(event) {
  deletingEvent.value = event
  isDeleteModalOpen.value = true
}

function openUploadModal(event) {
  uploadingForEvent.value = event
  isUploadModalOpen.value = true
}

function openScansDeleteModal(event) {
  scansDeleteEvent.value = event
  isScansDeleteModalOpen.value = true
}

function getActionItems(event) {
  return [
    [
      { label: 'Open scanner', icon: 'i-lucide-scan-line', onSelect: () => router.push(`/scanner/${event.id}`) },
      { label: 'Upload tickets', icon: 'i-lucide-upload', onSelect: () => openUploadModal(event) },
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEditModal(event) }
    ],
    [
      { label: 'Clear scan logs', icon: 'i-lucide-scan-line', color: 'error', onSelect: () => openScansDeleteModal(event) },
      { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => openDeleteModal(event) }
    ]
  ]
}

onMounted(fetchEvents)
</script>
