import tailwindcss from "@tailwindcss/vite"; 

export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys (only available on server-side)
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      }
    }
  },
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
    "@vueuse/nuxt",
    "shadcn-nuxt",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/seo",
    "@nuxt/icon",
    "nuxt-svgo",
    '@vueuse/nuxt',
  ],

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
    componentName: 'Icon',
    provider: 'server',
  },
  // 1. Desactivar CSP en desarrollo
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,        // ← desactiva CSP completo
    },
  },
  nitro: {
    externals: {
      inline: ['@prisma/client']
    }
  }, 
})