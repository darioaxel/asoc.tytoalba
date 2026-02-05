import { PostData } from '../types'

export const landingPosts: PostData[] =  [
  {
    title: 'Desplegando Nuxt 4 con Docker',
    excerpt: 'Guía paso a paso para levantar tu aplicación en producción con Docker y Traefik.',
    content: `# Desplegando Nuxt 4 con Docker

Docker se ha convertido en la herramienta estándar para el despliegue de aplicaciones modernas. En este artículo exploraremos cómo containerizar una aplicación Nuxt 4 para producción.

## ¿Por qué Docker?

- **Portabilidad**: Tu aplicación funcionará igual en cualquier entorno
- **Escalabilidad**: Fácil de replicar y escalar horizontalmente
- **Aislamiento**: Cada contenedor tiene su propio entorno

## Configuración básica

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
\`\`\`

## Docker Compose con Traefik

Integraremos Traefik como reverse proxy para gestionar automáticamente los certificados SSL con Let's Encrypt.

¡Siguiente artículo profundizaremos en CI/CD con GitHub Actions!`,
    cover: 'https://picsum.photos/seed/post1/600/400',
    tags: ['Docker', 'Nuxt'],
    published: true,
    publishedAt: new Date('2026-01-12T10:00:00Z'),
  },
  {
    title: 'Tailwind CSS 4: novedades',
    excerpt: 'Repaso a las características más destacadas de la próxima versión.',
    content: `# Tailwind CSS 4: Novedades

Tailwind CSS 4 llega con mejoras significativas en rendimiento y nuevas características que agilizan el desarrollo.

## Novedades principales

- **Compilador más rápido**: 3x más rápido que v3
- **Nuevas utilidades**: 50+ clases nuevas
- **Mejor soporte dark mode**: Detección automática del sistema

## Ejemplo práctico

\`\`\`html
<div class="bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-800 dark:to-pink-800">
  <h1 class="text-4xl font-bold text-white dark:text-gray-100">
    Hello Tailwind 4!
  </h1>
</div>
\`\`\`

## Migración desde v3

La migración es sencilla gracias al comando:
\`\`\`bash
npx @tailwindcss/upgrade
\`\`\``,
    cover: 'https://picsum.photos/seed/post2/600/400',
    tags: ['CSS', 'Tailwind'],
    published: true,
    publishedAt: new Date('2026-01-10T10:00:00Z'),
  },
  {
    title: 'Type-safe SQL con Kysely',
    excerpt: 'Olvida los errores de runtime en tus queries gracias a Kysely.',
    content: `# Type-safe SQL con Kysely

Kysely es un query builder type-safe para TypeScript que te permite escribir SQL con autocompletado y validación en tiempo de compilación.

## ¿Por qué Kysely?

- **100% TypeScript**: Cero runtime overhead
- **IntelliSense**: Autocompletado en tus queries
- **Type safety**: Detecta errores en tiempo de compilación

## Ejemplo básico

\`\`\`typescript
import { Kysely } from 'kysely'

interface Database {
  person: {
    id: Generated<number>
    first_name: string
    last_name: string | null
  }
}

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL })
  })
})

const people = await db
  .selectFrom('person')
  .select(['id', 'first_name'])
  .where('last_name', '=', 'Smith')
  .execute()
\`\`\`

## Comparación con Prisma

Mientras Prisma genera un cliente completo, Kysely te da control total sobre el SQL generado.`,
    cover: 'https://picsum.photos/seed/post3/600/400',
    tags: ['TypeScript', 'DB'],
    published: true,
    publishedAt: new Date('2026-01-08T10:00:00Z'),
  },
  {
    title: 'Auto-deploy con GitHub Actions',
    excerpt: 'Configura CI/CD para tu repo de Nuxt en menos de 10 minutos.',
    content: `# Auto-deploy con GitHub Actions

Automatiza el despliegue de tu aplicación Nuxt con GitHub Actions. Cada push a main desplegará automáticamente tu aplicación.

## Workflow básico

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to server
      run: |
        # Tu script de despliegue aquí
        echo "Deploying..."
\`\`\`

## Secrets necesarios

Configura en GitHub Settings > Secrets:
- \`SSH_PRIVATE_KEY\`: Para conexión SSH
- \`REMOTE_HOST\`: IP de tu servidor
- \`REMOTE_USER\`: Usuario SSH

## Optimizaciones

- Cache de dependencias
- Notificaciones de éxito/fallo
- Despliegue blue-green`,
    cover: 'https://picsum.photos/seed/post4/600/400',
    tags: ['CI/CD', 'GitHub'],
    published: true,
    publishedAt: new Date('2026-01-05T10:00:00Z'),
  },
  {
    title: 'Optimizando imágenes en Nuxt',
    excerpt: 'Reduce el peso de tus imágenes sin perder calidad con el módulo Nuxt Image.',
    content: `# Optimizando imágenes en Nuxt

Las imágenes suelen ser el mayor problema de rendimiento en aplicaciones web. Nuxt Image viene al rescate.

## Instalación

\`\`\`bash
npm install @nuxt/image
\`\`\`

\`\`\`javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  }
})
\`\`\`

## Uso básico

\`\`\`vue
<template>
  <nuxt-img 
    src="/images/hero.jpg"
    sizes="sm:100vw md:50vw lg:400px"
    format="webp"
    quality="80"
    loading="lazy"
  />
</template>
\`\`\`

## Proveedores soportados

- **ipx**: Por defecto, procesamiento local
- **cloudinary**: CDN con transformaciones
- **imagekit**: Optimización global
- **netlify**: Para despliegues en Netlify

## Resultados

- 70% reducción en tamaño promedio
- Carga 3x más rápida
- Mejor puntuación en Lighthouse`,
    cover: 'https://picsum.photos/seed/post5/600/400',
    tags: ['Performance', 'Nuxt'],
    published: true,
    publishedAt: new Date('2026-01-03T10:00:00Z'),
  },
  {
    title: 'SSR vs SSG: qué elegir',
    excerpt: 'Cuándo conviene usar renderizado en tiempo real y cuándo generar estáticos.',
    content: `# SSR vs SSG: qué elegir

La elección entre Server-Side Rendering (SSR) y Static Site Generation (SSG) impacta directamente en el rendimiento, SEO y experiencia de usuario.

## Server-Side Rendering (SSR)

**Ventajas:**
- Contenido siempre fresco
- Mejor para datos dinámicos
- Personalización por usuario

**Desventajas:**
- Mayor tiempo de respuesta
- Más carga en el servidor
- Complejidad en caché

## Static Site Generation (SSG)

**Ventajas:**
- Máximo rendimiento
- CDN-friendly
- Menos coste servidor

**Desventajas:**
- Build time aumenta
- No apto para contenido muy dinámico
- Rebuild necesario para cambios

## ¿Cuándo usar cada uno?

### Usa SSR cuando:
- Contenido personalizado por usuario
- Datos en tiempo real
- Dashboards administrativos

### Usa SSG cuando:
- Blogs y documentación
- Páginas de marketing
- Catálogos con actualización periódica

## Híbrido: ISR

Incremental Static Regeneration combina lo mejor de ambos mundos.`,
    cover: 'https://picsum.photos/seed/post6/600/400',
    tags: ['Arquitectura'],
    published: true,
    publishedAt: new Date('2026-01-01T10:00:00Z'),
  },
  {
    title: 'Intro a VueUse',
    excerpt: 'Acelera tu desarrollo con la librería de composables de Vue.',
    content: `# Intro a VueUse

VueUse es una colección de composables de Vue 3 que te ahorran horas de desarrollo.

## Composables más útiles

### useDark
\`\`\`vue
<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button @click="toggleDark()">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>
\`\`\`

### useLocalStorage
\`\`\`javascript
const state = useLocalStorage('my-store', {
  name: 'Apple',
  color: 'red',
})
// Persiste automáticamente
\`\`\`

### useMouse
\`\`\`javascript
const { x, y } = useMouse()
\`\`\`

### useFetch
\`\`\`javascript
const { data, error, isFetching } = useFetch('https://api.github.com/users/vueuse')
\`\`\`

## Instalación

\`\`\`bash
npm i @vueuse/core @vueuse/nuxt
\`\`\`

\`\`\`javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
})
\`\`\``,
    cover: 'https://picsum.photos/seed/post7/600/400',
    tags: ['Vue', 'Composable'],
    published: true,
    publishedAt: new Date('2025-12-28T10:00:00Z'),
  },
  {
    title: 'Monorepo con Nx y NPM workspaces',
    excerpt: 'Organiza tu código compartido entre front y back sin perder la cabeza.',
    content: `# Monorepo con Nx y NPM workspaces

Gestionar múltiples proyectos relacionados puede ser un dolor de cabeza. Los monorepos llegan para solucionarlo.

## ¿Por qué monorepo?

- **Código compartido**: Utils, tipos, componentes
- **Versionado unificado**: Todos los paquetes en sincronía
- **CI/CD simplificada**: Un pipeline para todos

## Estructura básica

\`\`\`
mi-proyecto/
├── apps/
│   ├── web/          # Nuxt frontend
│   └── api/          # NestJS backend
├── libs/
│   ├── shared/       # Tipos y utilidades
│   └── ui/          # Componentes compartidos
├── package.json
└── nx.json
\`\`\`

## Setup con Nx

\`\`\`bash
npx create-nx-workspace@latest mi-proyecto
cd mi-proyecto

# Añadir apps
nx g @nx/nuxt:app web
nx g @nx/nest:app api

# Librería compartida
nx g @nx/js:lib shared
\`\`\`

## NPM Workspaces (alternativa ligera)

\`\`\`json
// package.json
{
  "workspaces": ["apps/*", "libs/*"]
}
\`\`\`

## Importaciones limpias

\`\`\`typescript
import { User } from '@mi-proyecto/shared'
import { Button } from '@mi-proyecto/ui'
\`\`\``,
    cover: 'https://picsum.photos/seed/post8/600/400',
    tags: ['Monorepo'],
    published: true,
    publishedAt: new Date('2025-12-25T10:00:00Z'),
  },
  {
    title: 'Testing con Vitest en Nuxt',
    excerpt: 'Configura Vitest + Vue Test Utils para tus componentes y composables.',
    content: `# Testing con Vitest en Nuxt

Vitest es el sucesor espiritual de Jest, optimizado para Vite y con soporte nativo para TypeScript.

## Instalación

\`\`\`bash
npm i -D vitest @vue/test-utils @nuxt/test-utils
\`\`\`

\`\`\`javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
\`\`\`

## Test de componentes

\`\`\`vue
<!-- components/Counter.vue -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
  </div>
</template>

<script setup>
const count = ref(0)
const increment = () => count.value++
</script>
\`\`\`

\`\`\`typescript
// components/Counter.test.ts
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

test('increments count on click', async () => {
  const wrapper = mount(Counter)
  
  expect(wrapper.text()).toContain('Count: 0')
  
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.text()).toContain('Count: 1')
})
\`\`\`

## Test de composables

\`\`\`typescript
// composables/useCounter.test.ts
import { useCounter } from './useCounter'

test('useCounter', () => {
  const { count, increment } = useCounter()
  
  expect(count.value).toBe(0)
  increment()
  expect(count.value).toBe(1)
})
\`\`\`

## Coverage

\`\`\`bash
vitest run --coverage
\`\`\``,
    cover: 'https://picsum.photos/seed/post9/600/400',
    tags: ['Testing', 'Vitest'],
    published: true,
    publishedAt: new Date('2025-12-22T10:00:00Z'),
  },
  {
    title: 'Seguridad en APIs con Nuxt',
    excerpt: 'Validación de tokens, CORS y rate-limiting en tus endpoints.',
    content: `# Seguridad en APIs con Nuxt

La seguridad no es opcional. Vamos a cubrir las bases para proteger tus APIs en Nuxt.

## 1. Validación de Tokens JWT

\`\`\`typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token requerido'
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    event.context.user = decoded
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token inválido'
    })
  }
})
\`\`\`

## 2. CORS Configurado

\`\`\`typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS?.split(',') || '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
      }
    }
  }
})
\`\`\`

## 3. Rate Limiting

\`\`\`typescript
// server/utils/rateLimit.ts
const requests = new Map()

export function checkRateLimit(ip: string, limit = 100, window = 60000) {
  const now = Date.now()
  const userRequests = requests.get(ip) || []
  
  // Limpiar requests antiguas
  const validRequests = userRequests.filter(time => now - time < window)
  
  if (validRequests.length >= limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests'
    })
  }
  
  validRequests.push(now)
  requests.set(ip, validRequests)
}
\`\`\`

## 4. Validación de Entrada

\`\`\`typescript
// server/api/users.post.ts
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const data = schema.parse(body)
    // Procesar datos válidos...
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos inválidos',
      data: error.errors
    })
  }
})
\`\`\``,
    cover: 'https://picsum.photos/seed/post10/600/400',
    tags: ['Seguridad', 'API'],
    published: true,
    publishedAt: new Date('2025-12-20T10:00:00Z'),
  },
]