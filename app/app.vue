<script setup>
const url = useRequestURL()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#ffffff' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', href: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'canonical', href: `https://ticket-scan.com${url.pathname}` }
  ],
  script: [
    { src: 'https://www.googletagmanager.com/gtag/js?id=G-4MD3HZX5TN', async: true },
    {
      innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4MD3HZX5TN');`
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
