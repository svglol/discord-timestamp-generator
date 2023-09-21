// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-vitest', '@nuxt/devtools', '@nuxt/ui', '@vueuse/nuxt'],
  devtools: { enabled: true },
  ssr: false,
})
