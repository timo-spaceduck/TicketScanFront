<template>
  <div class="h-dvh bg-default text-highlighted flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex items-center gap-3 px-4 py-3 bg-elevated/80 backdrop-blur-sm border-b border-default shrink-0 z-10">
      <button
        class="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center"
        @click="$router.push('/scanner')"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-5 text-muted"
        />
      </button>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-highlighted truncate">
          {{ eventTitle }}
        </p>
        <p class="text-xs text-muted">
          {{ scannedCount }} / {{ totalCount }} scanned
        </p>
      </div>

      <div
        class="flex items-center gap-1.5 text-xs shrink-0"
        :class="isOnline ? 'text-emerald-500' : 'text-amber-500'"
      >
        <div
          class="size-2 rounded-full"
          :class="isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
        />
        <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
        <span
          v-if="pendingCount > 0"
          class="text-amber-500"
        >({{ pendingCount }})</span>
      </div>
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
        <!--        <div class="relative z-10 w-64 h-64 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"> -->
        <div class="relative z-10 w-64 h-64 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]">
          <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl" />
          <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr" />
          <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl" />
          <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br" />
          <div class="scan-line absolute inset-x-0 h-0.5 bg-primary/80 shadow-[0_0_6px_2px_rgba(var(--ui-primary)/0.5)]" />
        </div>
        <p class="absolute bottom-28 text-xs text-white/60 tracking-wide z-10">
          Point camera at QR code or barcode
        </p>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-default/95 flex flex-col items-center justify-center gap-4"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-10 animate-spin text-primary"
        />
        <p class="text-sm text-muted">
          {{ loadingMessage }}
        </p>
      </div>

      <!-- Error overlay -->
      <div
        v-if="initError"
        class="absolute inset-0 bg-default/98 flex flex-col items-center justify-center gap-5 px-8 text-center"
      >
        <UIcon
          name="i-lucide-camera-off"
          class="size-14 text-muted"
        />
        <div>
          <p class="text-sm font-medium text-highlighted mb-1">
            Scanner unavailable
          </p>
          <p class="text-xs text-muted">
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

      <!-- Scan result modal -->
      <ScanResultModal
        v-model:open="isTicketModalOpen"
        :ticket="scannedTicket"
        :status="scannedTicketStatus"
      />

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
import { apiGetEvent, apiGetEventTickets, apiPostScans, apiLookupScan } from '~/api/scanner.api'

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

const isTicketModalOpen = ref(false)
const scannedTicket = ref(null)
const scannedTicketStatus = ref('valid')

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
    scanQueue.value = JSON.parse(localStorage.getItem(cacheKey('queue')) || '[]')
    pendingCount.value = scanQueue.value.length
  } catch {}
  scannedCodes.clear()
  localStorage.removeItem(cacheKey('scanned'))
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
    const res = await apiPostScans(eventId, batch)
    if (res.success) {
      clearData(false)
    }
  } catch {}
}

// ─── Scanner ───────────────────────────────────────────────────

async function startCamera() {
  const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')

  scanner = new Html5Qrcode('qr-reader', {
    verbose: false,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_93,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.DATA_MATRIX
    ]
  })

  await scanner.start(
    { facingMode: 'environment' },
    {
      fps: 30,
      // aspectRatio: window.innerHeight / window.innerWidth,
      // qrbox: (w, h) => ({
      //   width: Math.round(Math.min(w, h) * 0.85),
      //   height: Math.round(Math.min(w, h) * 0.45)
      // }),
      experimentalFeatures: { useBarCodeDetectorIfSupported: true }
    },
    handleScan,
    () => {}
  )
}

async function handleScan(code) {
  const now = Date.now()
  if (code === lastCode && now - lastCodeTime < 2500) return
  lastCode = code
  lastCodeTime = now

  scanner?.pause(true)

  if (isOnline.value) {
    await handleScanOnline(code)
  } else {
    handleScanOffline(code)
  }
}

async function handleScanOnline(code) {
  try {
    const ticketData = await apiLookupScan(eventId, code)
    const ticket = ticketData?.ticket || null
    if (!ticket) {
      showResult({ status: 'invalid', icon: 'i-lucide-x-circle', title: 'Invalid ticket', subtitle: code })
      scanner?.resume()
      return
    }
    if (ticket.scans && ticket.scans.length > 0) {
      scannedTicket.value = { ...ticket, code }
      scannedTicketStatus.value = 'already_scanned'
      isTicketModalOpen.value = true
    } else {
      scannedCodes.add(code)
      saveScanned()
      scanQueue.value.push({ code, scanned_at: new Date().toISOString() })
      saveQueue()
      trySyncQueue()
      scannedTicket.value = { ...ticket, code }
      scannedTicketStatus.value = 'valid'
      isTicketModalOpen.value = true
    }
  } catch {
    handleScanOffline(code)
  }
}

function handleScanOffline(code) {
  if (scannedCodes.has(code)) {
    const ticket = ticketMap.get(code)
    scannedTicket.value = ticket ? { ...ticket, code } : { code }
    scannedTicketStatus.value = 'already_scanned'
    isTicketModalOpen.value = true
    return
  }

  const ticket = ticketMap.get(code)
  if (ticket) {
    scannedCodes.add(code)
    saveScanned()
    scanQueue.value.push({ code, scanned_at: new Date().toISOString() })
    saveQueue()
    trySyncQueue()
    scannedTicket.value = { ...ticket, code }
    scannedTicketStatus.value = 'valid'
    isTicketModalOpen.value = true
  } else {
    showResult({ status: 'invalid', icon: 'i-lucide-x-circle', title: 'Invalid ticket', subtitle: code })
    scanner?.resume()
  }
}

watch(isTicketModalOpen, (open) => {
  if (!open) {
    lastCode = ''
    lastCodeTime = 0
    scanner?.resume()
  }
})

function showResult(result) {
  lastResult.value = result
  clearTimeout(resultTimer)
  resultTimer = setTimeout(() => {
    lastResult.value = null
  }, 2500)
}

const clearData = (withTickets = true) => {
  scanQueue.value = []
  saveQueue()
  if (withTickets) localStorage.setItem(cacheKey('tickets'), '[]')
  localStorage.setItem(cacheKey('scanned'), '[]')
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

function onOnline() {
  isOnline.value = true
  trySyncQueue()
}

function onOffline() {
  isOnline.value = false
}

onMounted(() => {
  // clearData()
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
