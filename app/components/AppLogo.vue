<template>
  <svg
    id="scan-alt"
    viewBox="0 0 800 800"
    data-name="Flat Color"
    xmlns="http://www.w3.org/2000/svg"
    class="icon flat-color"
  >
    <path
      class="a"
      stroke-linecap="round"
      :stroke="borderColor"
      stroke-width="40"
      fill="none"
      d="m66.7 300v-83.3c0-83 57-150 150-150h83.3"
    />
    <path
      class="a"
      stroke-linecap="round"
      :stroke="borderColor"
      stroke-width="40"
      fill="none"
      d="m500 66.7h83.3c83 0 150 57 150 150v83.3"
    />
    <path
      class="a"
      stroke-linecap="round"
      :stroke="borderColor"
      stroke-width="40"
      fill="none"
      d="m733.3 533.3v50c0 83-57 150-150 150h-50"
    />
    <path
      class="a"
      stroke-linecap="round"
      :stroke="borderColor"
      stroke-width="40"
      fill="none"
      d="m300 733.3h-83.3c-83 0-150-57-150-150v-83.3"
    />
    <path
      class="a"
      transform="rotate(-50) scale(0.55)"
      transform-origin="center"
      stroke-linecap="round"
      stroke="var(--color-brand-500)"
      stroke-width="60"
      fill="none"
      d="m650 416.7c0-46 37.3-83.4 83.3-83.4v-33.3c0-133.3-33.3-166.7-166.6-166.7h-333.4c-133.3 0-166.6 33.4-166.6 166.7v16.7c46 0 83.3 37.3 83.3 83.3 0 46-37.3 83.3-83.3 83.3v16.7c0 133.3 33.3 166.7 166.6 166.7h333.4c133.3 0 166.6-33.4 166.6-166.7-46 0-83.3-37.3-83.3-83.3z"
    />
<!--    <path-->
<!--      class="b"-->
<!--      transform="scale(0.55)"-->
<!--      transform-origin="center"-->
<!--      stroke-linecap="round"-->
<!--      stroke-linejoin="round"-->
<!--      stroke="var(--color-brand-500)"-->
<!--      stroke-width="60"-->
<!--      fill="none"-->
<!--      stroke-dasharray="166.66666666666669,166.66666666666669"-->
<!--      d="m333.3 133.3v533.4"-->
<!--    />-->
  </svg>
</template>

<script setup>
const colorMode = useColorMode()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const borderColor = computed(() => {
  if (!mounted.value) return '#222'
  return colorMode.value === 'dark' ? 'oklch(0.929 0.013 255.508)' : '#222'
})
</script>
