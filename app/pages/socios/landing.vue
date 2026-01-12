<template>
  <div class="max-w-5xl mx-auto px-6 py-10 space-y-8">
    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-3xl font-bold">Blog oficial</h1>
      <p class="text-muted-foreground">Novedades, tutoriales y notas de desarrollo.</p>
    </header>

    <!-- Filtro -->
    <Input
      v-model="globalFilter"
      placeholder="Buscar por título, autor o etiqueta…"
      class="max-w-sm"
    />

    <!-- Listado de cards -->
    <div class="space-y-6">
      <BlogCardHorizontal
        v-for="row in table.getRowModel().rows"
        :key="row.original.id"
        :cover="row.original.cover"
        :title="row.original.title"
        :excerpt="row.original.excerpt"
        :author-name="row.original.author"
        :author-avatar="row.original.avatar"
        :published-at="row.original.date"
        :tags="row.original.tags"
        @read="navigateTo(`/blog/${row.original.slug}`)"
        @share="sharePost(row.original.title)"
      />
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between">
      <Button
        size="sm"
        @click="table.previousPage()"
        :disabled="!table.getCanPreviousPage()"
      >
        Anterior
      </Button>
      <span class="text-sm text-muted-foreground">
        Página {{ table.getState().pagination.pageIndex + 1 }} de {{ table.getPageCount() }}
      </span>
      <Button
        size="sm"
        @click="table.nextPage()"
        :disabled="!table.getCanNextPage()"
      >
        Siguiente
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

import { useVueTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/vue-table'
import { ref } from 'vue'

type Post = {
  id: number
  title: string
  excerpt: string
  author: string
  avatar: string
  date: string
  cover: string
  tags: string[]
  slug: string
}

// 10 posts de prueba
const posts = ref<Post[]>([
  {
    id: 1,
    title: 'Desplegando Nuxt 4 con Docker',
    excerpt: 'Guía paso a paso para levantar tu aplicación en producción con Docker y Traefik.',
    author: 'Ana Gómez',
    avatar: 'https://i.pravatar.cc/40?u=ana',
    date: '12 ene 2026',
    cover: 'https://picsum.photos/seed/post1/600/400',
    tags: ['Docker', 'Nuxt'],
    slug: 'desplegando-nuxt-4-con-docker',
  },
  {
    id: 2,
    title: 'Tailwind CSS 4: novedades',
    excerpt: 'Repaso a las características más destacadas de la próxima versión.',
    author: 'Luis Martínez',
    avatar: 'https://i.pravatar.cc/40?u=luis',
    date: '10 ene 2026',
    cover: 'https://picsum.photos/seed/post2/600/400',
    tags: ['CSS', 'Tailwind'],
    slug: 'tailwind-css-4-novedades',
  },
  {
    id: 3,
    title: 'Type-safe SQL con Kysely',
    excerpt: 'Olvida los errores de runtime en tus queries gracias a Kysely.',
    author: 'Marta Sánchez',
    avatar: 'https://i.pravatar.cc/40?u=marta',
    date: '08 ene 2026',
    cover: 'https://picsum.photos/seed/post3/600/400',
    tags: ['TypeScript', 'DB'],
    slug: 'type-safe-sql-kysely',
  },
  {
    id: 4,
    title: 'Auto-deploy con GitHub Actions',
    excerpt: 'Configura CI/CD para tu repo de Nuxt en menos de 10 minutos.',
    author: 'Carlos Ruiz',
    avatar: 'https://i.pravatar.cc/40?u=carlos',
    date: '05 ene 2026',
    cover: 'https://picsum.photos/seed/post4/600/400',
    tags: ['CI/CD', 'GitHub'],
    slug: 'auto-deploy-github-actions',
  },
  {
    id: 5,
    title: 'Optimizando imágenes en Nuxt',
    excerpt: 'Reduce el peso de tus imágenes sin perder calidad con el módulo Nuxt Image.',
    author: 'Elena Torres',
    avatar: 'https://i.pravatar.cc/40?u=elena',
    date: '03 ene 2026',
    cover: 'https://picsum.photos/seed/post5/600/400',
    tags: ['Performance', 'Nuxt'],
    slug: 'optimizando-imagenes-nuxt',
  },
  // 5 extras para probar paginación
  {
    id: 6,
    title: 'SSR vs SSG: qué elegir',
    excerpt: 'Cuándo conviene usar renderizado en tiempo real y cuándo generar estáticos.',
    author: 'Pablo Vega',
    avatar: 'https://i.pravatar.cc/40?u=pablo',
    date: '01 ene 2026',
    cover: 'https://picsum.photos/seed/post6/600/400',
    tags: ['Arquitectura'],
    slug: 'ssr-vs-ssg-que-elegir',
  },
  {
    id: 7,
    title: 'Intro a VueUse',
    excerpt: 'Acelera tu desarrollo con la librería de composables de Vue.',
    author: 'Sara López',
    avatar: 'https://i.pravatar.cc/40?u=sara',
    date: '28 dic 2025',
    cover: 'https://picsum.photos/seed/post7/600/400',
    tags: ['Vue', 'Composable'],
    slug: 'intro-a-vueuse',
  },
  {
    id: 8,
    title: 'Monorepo con Nx y NPM workspaces',
    excerpt: 'Organiza tu código compartido entre front y back sin perder la cabeza.',
    author: 'Jorge Ramírez',
    avatar: 'https://i.pravatar.cc/40?u=jorge',
    date: '25 dic 2025',
    cover: 'https://picsum.photos/seed/post8/600/400',
    tags: ['Monorepo'],
    slug: 'monorepo-nx-npm-workspaces',
  },
  {
    id: 9,
    title: 'Testing con Vitest en Nuxt',
    excerpt: 'Configura Vitest + Vue Test Utils para tus componentes y composables.',
    author: 'Claudia Mora',
    avatar: 'https://i.pravatar.cc/40?u=claudia',
    date: '22 dic 2025',
    cover: 'https://picsum.photos/seed/post9/600/400',
    tags: ['Testing', 'Vitest'],
    slug: 'testing-vitest-nuxt',
  },
  {
    id: 10,
    title: 'Seguridad en APIs con Nuxt',
    excerpt: 'Validación de tokens, CORS y rate-limiting en tus endpoints.',
    author: 'Diego Herrera',
    avatar: 'https://i.pravatar.cc/40?u=diego',
    date: '20 dic 2025',
    cover: 'https://picsum.photos/seed/post10/600/400',
    tags: ['Seguridad', 'API'],
    slug: 'seguridad-apis-nuxt',
  },
])

const globalFilter = ref('')

const table = useVueTable({
  get data() { return posts.value },
  columns: [],
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    globalFilter: globalFilter.value,
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  initialState: { pagination: { pageSize: 5 } }, // ← 5 cards por página
})

function sharePost(title: string) {
  navigator.share?.({
    title,
    url: `${window.location.origin}/blog/${title.toLowerCase().replace(/\s+/g, '-')}`,
  }) ?? alert(`Compartir: ${title}`)
}
</script>