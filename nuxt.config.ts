import tailwindcss from "@tailwindcss/vite"; // ❌ ELIMINA ESTA LÍNEA

export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils',
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/color-mode",
    "@vee-validate/nuxt",
    "@nuxtjs/fontaine",
    "nuxt-vitalizer",
    "nuxt-security",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "shadcn-nuxt",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/seo",
    "@nuxt/icon",
    "nuxt-svgo"
  ],
  
  // ✅ AÑADE ESTA SECCIÓN
  fonts: {
    providers: {
      fontsource: false, // Desactiva Fontsource
      google: false      // Desactiva Google Fonts
    }
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },

  css: [
    "~/assets/css/tailwind.css",
    '@fontsource/inter/400.css',
    '@fontsource/inter/600.css',
  ],

  compatibilityDate: "2025-11-03",

  vite: {
     plugins: [tailwindcss()],
  },
  
  devtools: { enabled: true },
  
  icon: {
    provider: 'iconify',
    aliases: { /* ... */ }
  }
})