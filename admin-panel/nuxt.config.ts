export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: [
    '~/assets/css/main.css',
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'EGis Admin Panel',
      meta: [
        { name: 'description', content: 'EGis - Management solutions for urban infrastructure development.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1759739740/EG_sj9np4.jpg' }
      ]
    }
  }
})
