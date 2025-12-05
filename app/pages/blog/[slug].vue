<template>
  <div class="container">
    <article v-if="post">
      <!-- Cabecera del post -->
      <h1>{{ post.title }}</h1>
      <p class="text-gray-600">{{ post.description }}</p>
      <time class="text-sm text-gray-500">{{ post.date }}</time>



      <!-- Contenido markdown → HTML -->
      <ContentRenderer :value="post" class="prose prose-lg mt-6" />
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('posts').path(`/blog/${route.params.slug}`).first()
)
</script>