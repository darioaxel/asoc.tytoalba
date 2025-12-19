<template>
  <div class="container">
    <h1>Blog</h1>
    
    <div v-if="pending">Cargando posts...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="!posts?.length">No hay posts publicados</div>
    
    <article v-for="post in posts" :key="post.id" class="mb-8">
      <h2>       
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </h2>
      <p class="text-gray-600">{{ post.description }}</p>
      <time class="text-sm text-gray-500">{{ post.date }}</time>
      <div v-if="post.tags" class="mt-2">
        <span v-for="tag in post.tags" :key="tag" class="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-2">
          {{ tag }}
        </span>
      </div>
    </article>  
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending, error } = await useAsyncData('posts-list', () =>
  queryCollection('posts')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()
)

function slug(id: string) {
  return id.replace(/\.md$/, '')
}
</script>