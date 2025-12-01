<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Mi Blog</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="article in articles" 
        :key="article._path" 
        :to="article._path"
        class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
          <p class="text-gray-600 mb-3">{{ article.description }}</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>{{ formatDate(article.date) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('articles', () => {
  return queryContent()
    .where({ _path: /^\/articles/ })
    .sort({ date: -1 })
    .find()
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

useHead({
  title: 'Mi Blog',
  meta: [
    { name: 'description', content: 'Bienvenido a mi blog creado con Nuxt Content' }
  ]
})
</script>