import tailwindcss from "@tailwindcss/vite"; 

export default defineNuxtConfig({
  hooks: {
    // Desactivar completamente el prerender para evitar out of memory en build
    'prerender:routes'({ routes }) {
      routes.clear()
    }
  },
  app: {
    head: {
      title: 'Asociación Tyto Alba',
      titleTemplate: '%s - Tyto Alba',
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
    // "@nuxt/image", // Temporalmente deshabilitado - causa problemas con imágenes locales
    "@nuxt/fonts",
    // "@nuxtjs/seo", // Temporalmente deshabilitado - causa error useHead
    "@nuxt/icon",
    "nuxt-svgo",
    '@vueuse/nuxt',
    '@nuxt/content',
  ],

  // Configuración de color-mode para themes light/dark
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode'
  },

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
     build: {
       sourcemap: false, // Desactivar sourcemaps para evitar warnings de Tailwind
     },
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
      external: ['@prisma/client', '.prisma/client']
    },
    publicAssets: [
      {
        dir: 'public/uploads',
        baseURL: '/uploads',
        maxAge: 60 * 60 * 24 * 365 // 1 año de caché
      }
    ]
  }, 
})
