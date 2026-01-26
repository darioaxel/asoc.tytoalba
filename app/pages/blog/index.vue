<!-- pages/blog/index.vue -->
<template>
  <div class="max-w-5xl mx-auto px-6 py-10 space-y-8">
    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-3xl font-bold">Blog oficial</h1>
      <p class="text-muted-foreground">Novedades, tutoriales y notas de desarrollo.</p>
    </header>

    <!-- Filtros -->
    <div class="flex flex-col sm:flex-row gap-4">
      <Input
        v-model="search"
        placeholder="Buscar por título, autor o etiqueta…"
        class="max-w-sm"
      />
      <Select v-model="selectedTag">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Todas las etiquetas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas las etiquetas</SelectItem>
          <SelectItem v-for="tag in availableTags" :key="tag.slug" :value="tag.slug">
            {{ tag.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-6">
      <BlogCardHorizontalSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Listado de posts -->
    <div v-else-if="data?.posts.length" class="space-y-6">
      <BlogCardHorizontal
        v-for="post in data.posts"
        :key="post.id"
        :cover="post.cover"
        :title="post.title"
        :excerpt="post.excerpt"
        :author-name="`${post.author.firstName} ${post.author.lastName}`"
        :author-avatar="post.author.picture"
        :published-at="formatDate(post.publishedAt)"
        :tags="post.tags"
        @read="navigateTo(`/blog/${post.slug}`)"
        @share="sharePost(post.title, post.slug)"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">No se encontraron posts</p>
    </div>

    <!-- Paginación -->
    <div v-if="data?.posts.length" class="flex items-center justify-between">
      <Button
        size="sm"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Anterior
      </Button>
      <span class="text-sm text-muted-foreground">
        Página {{ currentPage }} de {{ data.pagination.pages }}
      </span>
      <Button
        size="sm"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === data.pagination.pages"
      >
        Siguiente
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

// Estado
const search = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = 5

// Debounce para búsqueda
const debouncedSearch = refDebounced(search, 300)

// Fetch posts con los nuevos campos
const { data, pending, refresh } = await useLazyFetch('/api/posts', {
  query: {
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    tag: selectedTag,
  },
})

// Tags disponibles
const availableTags = computed(() => {
  if (!data.value?.posts) return []
  const tagsMap = new Map()
  data.value.posts.forEach(post => {
    post.tags.forEach(tag => {
      tagsMap.set(tag.slug, tag)
    })
  })
  return Array.from(tagsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

// Métodos
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function goToPage(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function sharePost(title: string, slug: string) {
  const url = `${window.location.origin}/blog/${slug}`
  navigator.share?.({
    title,
    url,
  }) ?? alert(`Compartir: ${title}\n${url}`)
}

// Watchers
watch([debouncedSearch, selectedTag], () => {
  currentPage.value = 1
  refresh()
})
</script>