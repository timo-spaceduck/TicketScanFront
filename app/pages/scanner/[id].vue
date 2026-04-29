<template>
  <div class="h-dvh bg-zinc-950 text-white flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex items-center gap-3 px-4 py-3 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 shrink-0 z-10">
      <button
        class="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
        @click="$router.push('/scanner')"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-5 text-zinc-300"
        />
      </button>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-zinc-100 truncate">
          {{ eventTitle }}
        </p>
        <p class="text-xs text-zinc-400">
          {{ scannedCount }} / {{ totalCount }} scanned
        </p>
      </div>

      <div
        class="flex items-center gap-1.5 text-xs shrink-0"
        :class="isOnline ? 'text-emerald-400' : 'text-amber-400'"
      >
        <div
          class="size-2 rounded-full"
          :class="isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'"
        />
        <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
        <span
          v-if="pendingCount > 0"
          class="text-amber-400"
        >({{ pendingCount }})</span>
      </div>

      <button
        class="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
        @click="$router.push('/dashboard')"
      >
        <UIcon
          name="i-lucide-layout-dashboard"
          class="size-5 text-zinc-300"
        />
      </button>
    </header>

    <!-- Camera area -->
    <div class="flex-1 relative overflow-hidden bg-black">
      <!-- html5-qrcode mounts its video into this div -->
      <div
        id="qr-reader"
        class="absolute inset-0 w-full h-full"
      />

      <!-- Scan frame overlay -->
      <div
        v-if="!isLoading && !initError"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative z-10 w-64 h-64">
          <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl" />
          <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr" />
          <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl" />
          <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br" />
          <div class="scan-line absolute inset-x-0 h-0.5 bg-primary/80 shadow-[0_0_6px_2px_rgba(var(--ui-primary)/0.5)]" />
        </div>
        <p class="absolute bottom-28 text-xs text-zinc-400 tracking-wide">
          Point camera at QR code or barcode
        </p>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center gap-4"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-10 animate-spin text-primary"
        />
        <p class="text-sm text-zinc-400">
          {{ loadingMessage }}
        </p>
      </div>

      <!-- Error overlay -->
      <div
        v-if="initError"
        class="absolute inset-0 bg-zinc-950/98 flex flex-col items-center justify-center gap-5 px-8 text-center"
      >
        <UIcon
          name="i-lucide-camera-off"
          class="size-14 text-zinc-600"
        />
        <div>
          <p class="text-sm font-medium text-zinc-300 mb-1">
            Scanner unavailable
          </p>
          <p class="text-xs text-zinc-500">
            {{ initError }}
          </p>
        </div>
        <button
          class="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
          @click="init"
        >
          Try again
        </button>
      </div>

      <!-- Scan result toast -->
      <Transition name="result">
        <div
          v-if="lastResult"
          class="absolute bottom-6 left-4 right-4 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-xl"
          :class="{
            'bg-emerald-500': lastResult.status === 'valid',
            'bg-red-500': lastResult.status === 'invalid',
            'bg-amber-500': lastResult.status === 'already_scanned'
          }"
        >
          <UIcon
            :name="lastResult.icon"
            class="size-7 shrink-0 text-white"
          />
          <div class="min-w-0">
            <p class="font-bold text-sm text-white">
              {{ lastResult.title }}
            </p>
            <p class="text-xs text-white/75 truncate">
              {{ lastResult.subtitle }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { apiGetEvent, apiGetEventTickets, apiPostScans } from '~/api/scanner.api'

definePageMeta({ layout: 'scanner', middleware: 'auth' })

const route = useRoute()
const eventId = route.params.id

useSeoMeta({ title: 'Scanner — TicketScan' })

const isLoading = ref(true)
const loadingMessage = ref('Loading tickets…')
const initError = ref('')

const eventTitle = ref('Scanner')
const isOnline = ref(true)
const lastResult = ref(null)
const pendingCount = ref(0)

const ticketMap = new Map()
const scannedCodes = new Set()
const scanQueue = ref([])

const scannedCount = computed(() => scannedCodes.size)
const totalCount = computed(() => ticketMap.size)

const cacheKey = k => `scanner_${eventId}_${k}`

let scanner = null
let resultTimer = null
let lastCode = ''
let lastCodeTime = 0

// ─── Cache ─────────────────────────────────────────────────────

function loadCache() {
  try {
    JSON.parse(localStorage.getItem(cacheKey('tickets')) || '[]')
      .forEach(t => ticketMap.set(t.code, t))
    JSON.parse(localStorage.getItem(cacheKey('scanned')) || '[]')
      .forEach(c => scannedCodes.add(c))
    scanQueue.value = JSON.parse(localStorage.getItem(cacheKey('queue')) || '[]')
    pendingCount.value = scanQueue.value.length
  } catch {}
}

function saveScanned() {
  localStorage.setItem(cacheKey('scanned'), JSON.stringify([...scannedCodes]))
}

function saveQueue() {
  localStorage.setItem(cacheKey('queue'), JSON.stringify(scanQueue.value))
  pendingCount.value = scanQueue.value.length
}

// ─── API ───────────────────────────────────────────────────────

async function fetchEvent() {
  try {
    const ev = await apiGetEvent(eventId)
    eventTitle.value = ev.title || ev.name || `Event ${eventId}`
  } catch {}
}

async function fetchTickets() {
  const res = await apiGetEventTickets(eventId)
  const list = Array.isArray(res) ? res : res.data ?? []
  ticketMap.clear()
  list.forEach(t => ticketMap.set(t.code, t))
  localStorage.setItem(cacheKey('tickets'), JSON.stringify(list))
}

async function trySyncQueue() {
  if (!isOnline.value || scanQueue.value.length === 0) return
  const batch = [...scanQueue.value]
  try {
    await apiPostScans(eventId, batch)
    scanQueue.value = []
    saveQueue()
  } catch {}
}

// ─── Scanner ───────────────────────────────────────────────────

async function startCamera() {
  console.log('startCamera')
  const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')

  scanner = new Html5Qrcode('qr-reader', {
    verbose: false,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.DATA_MATRIX
    ]
  })

  await scanner.start(
    { facingMode: 'environment' },
    {
      // fps: 15,
      // aspectRatio: window.innerHeight / window.innerWidth
    },
    (decodedText) => handleScan(decodedText),
    (error) => {
      console.error(error)
    }
  )
}

function handleScan(code) {
  console.log('SCANNED!!')
  const now = Date.now()
  if (code === lastCode && now - lastCodeTime < 2500) return
  lastCode = code
  lastCodeTime = now

  if (scannedCodes.has(code)) {
    showResult({ status: 'already_scanned', icon: 'i-lucide-alert-circle', title: 'Already scanned', subtitle: code })
    return
  }

  const ticket = ticketMap.get(code)
  if (ticket) {
    scannedCodes.add(code)
    saveScanned()
    scanQueue.value.push({ ticket_code: code, scanned_at: new Date().toISOString() })
    saveQueue()
    showResult({ status: 'valid', icon: 'i-lucide-check-circle', title: 'Valid ticket', subtitle: ticket.holder || ticket.holder_name || code })
    trySyncQueue()
  } else {
    showResult({ status: 'invalid', icon: 'i-lucide-x-circle', title: 'Invalid ticket', subtitle: code })
  }
}

function showResult(result) {
  lastResult.value = result
  clearTimeout(resultTimer)
  resultTimer = setTimeout(() => { lastResult.value = null }, 2500)
}

// ─── Init ──────────────────────────────────────────────────────

async function init() {
  isLoading.value = true
  initError.value = ''
  loadCache()

  try {
    loadingMessage.value = 'Fetching tickets…'
    await Promise.allSettled([fetchEvent(), fetchTickets()])

    if (ticketMap.size === 0) {
      throw new Error('No ticket data available. Check your connection and try again.')
    }

    loadingMessage.value = 'Starting camera…'
    await startCamera()
  } catch (err) {
    initError.value = err.message || 'Failed to start scanner.'
  } finally {
    isLoading.value = false
  }
}

// ─── Lifecycle ─────────────────────────────────────────────────

function onOnline() { isOnline.value = true; trySyncQueue() }
function onOffline() { isOnline.value = false }

onMounted(() => {
  isOnline.value = navigator.onLine
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
  init()
})

onBeforeUnmount(async () => {
  if (scanner?.isScanning) await scanner.stop()
  clearTimeout(resultTimer)
  window.removeEventListener('online', onOnline)
  window.removeEventListener('offline', onOffline)
})
</script>

<style scoped>
.scan-line {
  animation: scan 2.5s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { top: 0; }
  50% { top: calc(100% - 2px); }
}

.result-enter-active,
.result-leave-active {
  transition: all 0.25s ease;
}
.result-enter-from,
.result-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Strip html5-qrcode's own chrome — keep only the raw video feed */
:deep(#qr-reader > img),
:deep(#qr-reader__dashboard),
:deep(#qr-reader__header_message),
:deep(#qr-reader__filescan_input) {
  display: none !important;
}

:deep(#qr-reader video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  position: absolute !important;
  inset: 0 !important;
}

:deep(#qr-reader__scan_region) {
  position: absolute !important;
  inset: 0 !important;
  background: transparent !important;
}
</style>
