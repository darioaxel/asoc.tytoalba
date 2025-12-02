<template>
  <div class="container">
    <h1>Blog.. funcionando?</h1>
    <article v-for="post in posts" :key="post.id">
      <h2>     
        <NuxtLink :to="'/blog/' + slug(post.id)">{{ post.title }}</NuxtLink>
      </h2>
       <p>{{ post.id }}</p>
      <p>{{ post.description }}</p>
      <time>{{ post.date }}</time>
    </article>
  </div>
  <div>
    Todos los posts:{{ lista }}
  </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('articles-list', () =>
  queryCollection('articles').where('published', '=', true).order('date', 'DESC').all()
)

// app/pages/blog.vue  (temporal, solo para debug)
const { data: lista } = await useAsyncData('debug', () =>
  queryCollection('articles').select('id', 'path').all()
)

// helper: devuelve solo el slug final
function slug(id: string) {
  return id.replace(/^articles\/articles\//, '').replace(/\.md$/, '')
}
</script>