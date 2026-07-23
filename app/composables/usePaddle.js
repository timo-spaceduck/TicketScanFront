import { initializePaddle } from '@paddle/paddle-js'

let paddleInstance = null
let initPromise = null
const listeners = new Set()

function handleEvent(event) {
  listeners.forEach(listener => listener(event))
}

export function usePaddle() {
  async function getPaddle() {
    if (!import.meta.client) return null
    if (paddleInstance) return paddleInstance
    if (!initPromise) {
      const { public: { paddleClientToken, paddleEnvironment } } = useRuntimeConfig()
      initPromise = initializePaddle({
        token: paddleClientToken,
        environment: paddleEnvironment,
        eventCallback: handleEvent
      }).then((paddle) => {
        paddleInstance = paddle ?? null
        return paddleInstance
      }).catch(() => null)
    }
    return initPromise
  }

  function onCheckoutEvent(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getPaddle, onCheckoutEvent }
}
