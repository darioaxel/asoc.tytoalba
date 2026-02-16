<!-- pages/dashboard/index.vue -->
<template>
  <div class="min-h-screen">
    <!-- Header con imagen de fondo -->
    <PageHeader class="relative bg-cover bg-center bg-no-repeat" style="background-image: url('/images/old-page/socios.jpg');">
      <!-- Overlay oscuro para mejorar legibilidad -->
      <div class="absolute inset-0 bg-black/40"></div>
      <PageHeaderHeading class="relative z-10 text-white drop-shadow-lg">
        ¡Hola {{ userName }}! 👋
      </PageHeaderHeading>
      <PageHeaderDescription class="relative z-10 text-white/90 drop-shadow-md">
        Bienvenido a tu portal de la asociación
      </PageHeaderDescription>
    </PageHeader>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">

    <!-- Cards de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card: Tareas pendientes -->
      <Card class="hover:shadow-md transition-shadow">
        <CardHeader class="pb-3">
          <CardTitle class="text-lg flex items-center gap-2">
            <Icon name="lucide:clipboard-list" class="h-5 w-5 text-blue-500" />
            Mis Tareas
          </CardTitle>
          <CardDescription>Tareas asignadas pendientes</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">{{ pendingTasksCount }}</p>
          <p class="text-sm text-muted-foreground">
            {{ pendingTasksCount === 1 ? 'tarea pendiente' : 'tareas pendientes' }}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" as-child>
            <NuxtLink to="/socios/tareas">
              Ver mis tareas
              <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4" />
            </NuxtLink>
          </Button>
        </CardFooter>
      </Card>

      <!-- Card: Deuda -->
      <Card class="hover:shadow-md transition-shadow">
        <CardHeader class="pb-3">
          <CardTitle class="text-lg flex items-center gap-2">
            <Icon name="lucide:receipt" class="h-5 w-5 text-amber-500" />
            Mis Recibos
          </CardTitle>
          <CardDescription>Estado de tus cuotas</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold" :class="debt > 0 ? 'text-destructive' : 'text-green-600'">
            {{ formatCurrency(debt) }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ debt > 0 ? 'Deuda pendiente' : 'Sin deuda pendiente' }}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" as-child>
            <NuxtLink to="/socios/recibos">
              Ver mis recibos
              <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4" />
            </NuxtLink>
          </Button>
        </CardFooter>
      </Card>

      <!-- Card: Crear Noticia -->
      <Card class="hover:shadow-md transition-shadow border-primary/20">
        <CardHeader class="pb-3">
          <CardTitle class="text-lg flex items-center gap-2">
            <Icon name="lucide:file-plus" class="h-5 w-5 text-primary" />
            Crear Noticia
          </CardTitle>
          <CardDescription>Publica una nueva entrada en el blog</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Comparte noticias, eventos o información relevante con la comunidad.
          </p>
        </CardContent>
        <CardFooter>
          <Button class="w-full" as-child>
            <NuxtLink to="/socios/posts/crear">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Crear Noticia
            </NuxtLink>
          </Button>
        </CardFooter>
      </Card>
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
</div>
</template>

<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'
import { Icon } from '#components'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

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

/* ----------  estadísticas  ---------- */
const pendingTasksCount = ref(0)
const debt = ref(0)

// Cargar datos de tareas pendientes
const fetchPendingTasks = async () => {
  try {
    const data = await $fetch('/api/tasks?status=CREADA&page=1&limit=100')
    if (data?.tasks) {
      const myTasks = data.tasks.filter((t: any) => 
        t.assignees?.some((a: any) => a.user?.id === user.value?.id)
      )
      pendingTasksCount.value = myTasks.length
    }
  } catch (error) {
    console.error('Error cargando tareas:', error)
  }
}

// Cargar deuda de recibos
const fetchDebt = async () => {
  try {
    const data = await $fetch('/api/receipts/pending')
    debt.value = data?.totalDebt || 0
  } catch (error) {
    console.error('Error cargando deuda:', error)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Cargar datos al montar
onMounted(() => {
  fetchPendingTasks()
  fetchDebt()
})

/* ----------  autoplay  ---------- */
const plugins = [Autoplay({ delay: 3000 })]
function onInit(api: any) {
  // api está disponible si necesitas controlar algo manualmente
}
</script>