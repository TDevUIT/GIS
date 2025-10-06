<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - EGis Admin` : 'EGis Admin Panel';
  },
  htmlAttrs: {
    lang: 'en'
  }
})
</script>
