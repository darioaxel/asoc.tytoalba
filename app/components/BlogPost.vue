<script setup lang="ts">
import { format } from 'date-fns'
import { Lightbulb } from 'lucide-vue-next'
import { computed } from 'vue'

interface BlogPostData {
  title: string
  authorName: string
  image: string
  pubDate: string 
  description: string
  authorImage: string
}

const props = defineProps<{
  post?: BlogPostData
}>()

// CAMBIO 2: Usar computed con valores por defecto serializables
const postData = computed(() => {
  const defaults = {
    title: "Designing websites faster with shadcn-vue",
    authorName: "John Doe",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    pubDate: new Date().toISOString(), // String serializable
    description: "A step-by-step guide to building a modern blog.",
    authorImage: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
  }
  
  const merged = { ...defaults, ...props.post }
  
  return {
    ...merged,
    // Asegurar que pubDate sea un objeto Date para date-fns
    pubDateObj: new Date(merged.pubDate)
  }
})
</script>

<template>
  <section class="py-32">
    <div class="container">
      <div class="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <h1 class="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
          {{ postData.title }}
        </h1>
        <h3 class="text-muted-foreground max-w-3xl text-lg md:text-xl">
          {{ postData.description }}
        </h3>
        <!-- div class="flex items-center gap-3 text-sm md:text-base">
          <UiAvatar class="h-8 w-8 border">
            <UiAvatarImage :src="postData.authorImage" :alt="postData.authorName" />
            <UiAvatarFallback>{{ postData.authorName.charAt(0) }}</UiAvatarFallback>
          </UiAvatar>
          <span>
            <a href="#" class="font-semibold">{{ postData.authorName }}</a>
            <span class="ml-1">on {{ format(postData.pubDateObj, "MMMM d, yyyy") }}</span>
          </span>
        </div>
        <img
          :src="postData.image"
          alt="Blog post image"
          class="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
        />
      </div>
    </div>
    <div class="container">
      <div class="prose dark:prose-invert mx-auto max-w-3xl">
        <!-- Contenido estático igual que antes >
        <h2 class="text-3xl font-extrabold">The Great Joke Tax</h2>
        <p class="text-muted-foreground mt-2 text-lg">
          In a kingdom far away, where laughter once flowed freely...
        </p>
        
        <UiAlert>
          <Lightbulb class="h-4 w-4" />
          <UiAlertTitle>Royal Decree!</UiAlertTitle>
          <UiAlertDescription>
            Remember, all jokes must be registered at the Royal Jest Office
          </UiAlertDescription>
        </UiAlert>
        
        <!-- Resto del contenido... -->
      </div>
    </div>
  </section>
</template>