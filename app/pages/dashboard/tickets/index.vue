<template>
  <div class="p-4 sm:p-8 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Tickets
      </h1>
      <p class="text-sm text-muted mt-0.5">
        Upload a ticket list for an event
      </p>
    </div>

    <UCard>
      <div class="space-y-5">
        <UAlert
          v-if="uploadError"
          color="error"
          variant="soft"
          :description="uploadError"
          icon="i-lucide-circle-alert"
        />
        <UAlert
          v-if="uploadSuccess"
          color="success"
          variant="soft"
          :description="uploadSuccess"
          icon="i-lucide-check-circle"
        />

        <UFormField label="Event">
          <USelect
            v-model="selectedEventId"
            :items="eventOptions"
            size="xl"
            placeholder="Select an event"
            class="w-full"
            :disabled="loadingEvents"
          />
        </UFormField>

        <UFormField label="Ticket file">
          <div
            class="relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors"
            :class="isDragging
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-muted'"
            @click="fileInputRef?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xls,.csv"
              class="hidden"
              @change="onFileChange"
            >

            <UIcon
              :name="selectedFile ? 'i-lucide-file-check' : 'i-lucide-file-spreadsheet'"
              class="size-10 mx-auto mb-3"
              :class="selectedFile ? 'text-primary' : 'text-muted'"
            />

            <p
              class="text-sm font-medium"
              :class="selectedFile ? 'text-highlighted' : 'text-muted'"
            >
              {{ selectedFile ? selectedFile.name : 'Click to browse or drag & drop' }}
            </p>
            <p class="text-xs text-muted mt-1">
              {{ selectedFile
                ? formatFileSize(selectedFile.size)
                : 'Supports .xlsx, .xls, and .csv files' }}
            </p>

            <UButton
              v-if="selectedFile"
              size="xs"
              variant="ghost"
              color="neutral"
              leading-icon="i-lucide-x"
              class="mt-3"
              @click.stop="clearFile"
            >
              Remove
            </UButton>
          </div>
        </UFormField>

        <div class="flex justify-end">
          <UButton
            leading-icon="i-lucide-upload"
            :loading="uploading"
            :disabled="!selectedEventId || !selectedFile"
            @click="upload"
          >
            Upload tickets
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { apiGetEvents } from '~/api/events.api'
import { apiUploadTickets } from '~/api/tickets.api'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Tickets — TicketScan' })

const events = ref([])
const loadingEvents = ref(false)
const selectedEventId = ref(null)

const fileInputRef = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)

const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref('')

const eventOptions = computed(() =>
  events.value.map(e => ({ label: e.title, value: e.id }))
)

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) selectedFile.value = file
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) selectedFile.value = file
}

function clearFile() {
  selectedFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function upload() {
  if (!selectedEventId.value || !selectedFile.value) return
  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = ''
  try {
    await apiUploadTickets(selectedEventId.value, selectedFile.value)
    uploadSuccess.value = 'Tickets uploaded successfully!'
    clearFile()
  } catch (err) {
    uploadError.value = err?.response?.data?.message || 'Failed to upload tickets. Please try again.'
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  loadingEvents.value = true
  try {
    events.value = await apiGetEvents()
  } finally {
    loadingEvents.value = false
  }
})
</script>
