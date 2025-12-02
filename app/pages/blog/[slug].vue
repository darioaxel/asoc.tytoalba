<template>
 Hola mundo
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(
  `article-${route.params.slug}`,
  () => queryCollection('articles').path(`/articles/${route.params.slug}`).first()
)
if (!post.value) throw createError({ statusCode: 404 })
</script>