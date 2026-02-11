<!-- pages/dashboard/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
    <!-- Header personalizado -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold">¡Hola {{ userName }}! 👋</h1>
      <p class="text-lg text-muted-foreground">Bienvenido a tu portal de la asociación</p>
    </div>

    <!-- Carrusel de noticias -->
    <div class="relative">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">Últimas noticias</h2>
        <Button variant="ghost" size="sm" as-child>
          <NuxtLink to="/blog">Ver todas</NuxtLink>
        </Button>
      </div>

      <!-- autoplay & loop -->
      <Carousel
        class="w-full max-w-4xl mx-auto"
        :opts="{ align: 'start', loop: true }"
        :plugins="plugins"
        @init="onInit"
      >
        <CarouselContent>
          <CarouselItem
            v-for="post in latestPosts"
            :key="post.id"
            class="md:basis-1/2 lg:basis-1/3"
          >
            <div class="p-1">
              <Card class="h-full">
                <CardContent class="p-4 flex flex-col h-full">
                  <div
                    class="aspect-video w-full bg-cover bg-center rounded-md mb-4"
                    :style="{ backgroundImage: `url(${post.cover})` }"
                  />
                  <div class="flex-1">
                    <h3 class="font-semibold mb-2">{{ post.title }}</h3>
                    <p class="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {{ post.excerpt }}
                    </p>

                    <!-- autor con defensas -->
                    <div class="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Avatar class="h-4 w-4">
                        <AvatarImage :src="post.author?.picture" />
                        <AvatarFallback>
                          {{ post.author?.firstName?.charAt(0) || '?' }}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {{
                          post.author
                            ? `${post.author.firstName} ${post.author.lastName}`
                            : 'Autor desconocido'
                        }}
                      </span>
                      <span>•</span>
                      <time>{{ formatDate(post.publishedAt) }}</time>
                    </div>

                    <div class="flex flex-wrap gap-1 mb-3">
                      <Badge
                        v-for="tag in post.tags"
                        :key="tag.slug"
                        variant="secondary"
                        class="text-xs"
                      >
                        {{ tag.name }}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    @click="navigateTo(`/blog/${post.slug}`)"
                    size="sm"
                    class="w-full"
                  >
                    Leer más
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

   
  </div>
</template>

<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

/* ----------  usuario  ---------- */
const { user } = await useUserSession()
const userName = computed(() => {
  if (!user.value) return 'Usuario'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email
})

/* ----------  posts  ---------- */
const { data: postsData } = await useLazyFetch('/api/posts/latest', {
  query: { limit: 5 },
})
const latestPosts = computed(() => postsData.value?.posts ?? [])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/* ----------  estadísticas mock  ---------- */
const totalPosts = ref(42)
const recentActivity = ref(128)
const upcomingEvents = ref(3)

/* ----------  autoplay  ---------- */
const plugins = [Autoplay({ delay: 3000 })]
function onInit(api: any) {
  // api está disponible si necesitas controlar algo manualmente
}
</script>