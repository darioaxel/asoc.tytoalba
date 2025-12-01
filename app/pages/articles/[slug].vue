<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <NuxtLink to="/blog" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Volver al blog
    </NuxtLink>
    
    <article v-if="article" class="prose prose-lg mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ article.title }}</h1>
        <div class="flex items-center text-gray-600 mb-4">
          <span>Por {{ article.author || 'Autor desconocido' }}</span>
          <span class="mx-2">•</span>
          <time>{{ formatDate(article.date) }}</time>
        </div>
        <p class="text-xl text-gray-600">{{ article.description }}</p>
      </header>
      
      <ContentRenderer :value="article">
        <template #empty>
          <p>Cargando contenido...</p>
        </template>
      </ContentRenderer>
    </article>
    
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-semibold mb-4">Artículo no encontrado</h2>
      <NuxtLink to="/blog" class="text-blue-600 hover:text-blue-800">Volver al blog</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(slug, () => {
  return queryContent()
    .where({ _path: `/articles/${slug}` })
    .findOne()
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

useHead({
  title: article.value?.title || 'Artículo del blog',
  meta: [
    { 
      name: 'description', 
      content: article.value?.description || 'Artículo del blog creado con Nuxt Content' 
    }
  ]
})
</script>