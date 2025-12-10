import tailwindcss from "@tailwindcss/vite"; 

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
    "@vueuse/nuxt",
    "shadcn-nuxt",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/seo",
    "@nuxt/icon",
    "nuxt-svgo",
    "@nuxt/content",
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

  content: {
   experimental: {
      // antes se llamaba 'cacheVersion'; ahora:
      clientDb: false   // <= clave
    },
    // carpeta fuente por defecto: content/
    // prefixo de url: / (sin prefijo, así blog queda en /blog, docs en /docs)
    highlight: {
      theme: 'github-light',
      preload: ['ts', 'js', 'vue', 'sql']
    },
    // ignora la carpeta que usas para Prisma o cualquier otra
    ignores: ['^/prisma', '^/server']
  }
})