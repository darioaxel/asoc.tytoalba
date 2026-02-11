<!-- pages/blog/[slug].vue -->
<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <!-- Loading -->
    <div v-if="pending" class="space-y-8">
      <BlogPostSkeleton />
    </div>

    <!-- Post -->
    <article v-else-if="post" class="space-y-8">
      <!-- Header -->
      <header class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge v-for="tag in post.tags" :key="tag.slug" variant="secondary">
            {{ tag.name }}
          </Badge>
        </div>
        
        <h1 class="text-4xl font-bold tracking-tight">
          {{ post.title }}
        </h1>
        
        <p class="text-xl text-muted-foreground">
          {{ post.excerpt }}
        </p>

        <!-- Meta -->
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="post.author.picture" :alt="`${post.author.firstName} ${post.author.lastName}`" />
              <AvatarFallback>{{ post.author.firstName.charAt(0) }}{{ post.author.lastName.charAt(0) }}</AvatarFallback>
            </Avatar>
            <span>{{ post.author.firstName }} {{ post.author.lastName }}</span>
          </div>
          <time :datetime="post.publishedAt">
            {{ formatDate(post.publishedAt) }}
          </time>
          <Button
            variant="ghost"
            size="sm"
            @click="sharePost"
          >
            <Icon name="lucide:share-2" class="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </header>

      <!-- Cover -->
      <div v-if="post.cover" class="rounded-lg overflow-hidden">
        <img
          :src="post.cover"
          :alt="post.title"
          class="w-full h-auto"
        />
      </div>

      <!-- Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <MDC v-if="post.content" :value="post.content" />
      </div>

      <!-- Divider -->
      <Separator />

      <!-- Author card -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-4">
            <Avatar class="h-12 w-12">
              <AvatarImage :src="post.author.picture" :alt="`${post.author.firstName} ${post.author.lastName}`" />
              <AvatarFallback>{{ post.author.firstName.charAt(0) }}{{ post.author.lastName.charAt(0) }}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{{ post.author.firstName }} {{ post.author.lastName }}</CardTitle>
              <CardDescription>Autor del artículo</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </article>

    <!-- 404 -->
    <div v-else class="text-center py-12">
      <h1 class="text-2xl font-bold mb-4">Post no encontrado</h1>
      <p class="text-muted-foreground mb-6">
        El artículo que buscas no existe o no está disponible.
      </p>
      <Button @click="navigateTo('/blog')">
        Volver al blog
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Obtener slug
const route = useRoute()
const slug = route.params.slug as string

// Fetch post
const { data: post, pending, error } = await useLazyFetch(`/api/posts/${slug}`)

// SEO
useHead({
  title: () => post.value?.title || 'Blog',
  meta: [
    { name: 'description', content: () => post.value?.excerpt || 'Blog oficial' },
    { property: 'og:title', content: () => post.value?.title },
    { property: 'og:description', content: () => post.value?.excerpt },
    { property: 'og:image', content: () => post.value?.cover },
  ],
})



// Métodos
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function sharePost() {
  if (!post.value) return
  
  navigator.share?.({
    title: post.value.title,
    text: post.value.excerpt,
    url: window.location.href,
  }) ?? alert(`Compartir: ${post.value.title}`)
}

// Redirect 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post no encontrado',
  })
}
</script>