<template>
  <div class="p-8 max-w-5xl mx-auto">
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

    <UTable
      v-else
      :data="events"
      :columns="columns"
    >
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            leading-icon="i-lucide-pencil"
            @click="openEditModal(row.original)"
          >
            Edit
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            color="error"
            leading-icon="i-lucide-trash-2"
            @click="openDeleteModal(row.original)"
          >
            Delete
          </UButton>
        </div>
      </template>
    </UTable>

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
  </div>
</template>

<script setup>
import { apiGetEvents } from '~/api/events.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Events — TicketScan' })

const events = ref([])
const loading = ref(false)
const pageError = ref('')

const isFormModalOpen = ref(false)
const editingEvent = ref(null)

const isDeleteModalOpen = ref(false)
const deletingEvent = ref(null)

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
  { id: 'actions', header: '' }
]

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

onMounted(fetchEvents)
</script>
