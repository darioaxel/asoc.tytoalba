<!-- pages/index.vue (landing) -->
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="relative w-full">
      <!-- Fondo difuminado -->
      <div
        class="absolute inset-0 bg-cover bg-center blur-[2px]"
        style="background-image: url('/images/old-page/fondo-1.png')"
      />
      <!-- Capa oscura semitransparente para mejorar legibilidad -->
      <div class="absolute inset-0 bg-black/40" />
      <PageHeader class="relative z-10">
        <PageHeaderHeading class="max-w-4xl text-white">
          Asociación Tyto Alba
        </PageHeaderHeading>
        <PageHeaderDescription class="text-white/90">Mi descripción</PageHeaderDescription>
        <PageActions>
          <Button as-child size="sm">
            <NuxtLink to="/nosotros"> Nosotr@s </NuxtLink>
          </Button>
          <Button as-child size="sm" variant="secondary">
            <NuxtLink to="/blog"> Ver todo el blog </NuxtLink>
          </Button>
        </PageActions>
      </PageHeader>
    </div>

    <!-- Bento Grid con posts reales -->
    <BentoGrid class="grid w-full auto-rows-[22rem] grid-cols-3 gap-4 lg:grid-rows-3 mt-12">
      <BentoGridCard
        v-for="(post, index) in latestPosts"
        :key="post.id"
        :name="post.title"
        :description="post.excerpt"
        :href="`/blog/${post.slug}`"
        cta="Leer artículo"
        :class="getBentoClass(index)"
      >
        <template #background>
          <div
            v-if="post.cover"
            class="absolute inset-0 bg-cover bg-center opacity-40 transition duration-150 ease-in-out group-hover:opacity-20"
            :style="{ backgroundImage: `url(${post.cover})` }"
          />
          <div
            v-else
            class="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"
          />
        </template>

        <template #overlay>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </template>
      </BentoGridCard>
    </BentoGrid>
  </div>
</template>

<script lang="ts" setup>
// Fetch últimos 5 posts publicados
const { data: postsData } = await useLazyFetch('/api/posts/latest', {
  query: { limit: 5 }
})

const latestPosts = computed(() => postsData.value?.posts || [])

// Asigna clases responsivas según posición
function getBentoClass(index: number) {
  const classes = [
    'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',   // Post 1 (grande izq)
    'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3',   // Post 2 (grande centro)
    'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',   // Post 3 (peq arr-dcha)
    'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',   // Post 4 (peq abj-izq)
    'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',   // Post 5 (peq abj-dcha)
  ]
  return classes[index] || ''
}
</script>