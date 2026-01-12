<template>
  <Card class="grid grid-cols-3 gap-0 p-0 overflow-hidden">
    <!-- IZQUIERDA: imagen -->
    <div class="col-span-1">
      <img
        :src="cover"
        alt="Cover"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- DERECHA: contenido -->
    <div class="col-span-2 flex flex-col justify-between p-5">
      <div>
        <!-- meta -->
        <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Avatar class="h-6 w-6">
            <AvatarImage :src="authorAvatar" />
            <AvatarFallback>{{ authorName[0] }}</AvatarFallback>
          </Avatar>
          <span>{{ authorName }}</span>
          <Separator orientation="vertical" class="h-3" />
          <time>{{ publishedAt }}</time>
        </div>

        <!-- título -->
        <h3 class="text-lg font-semibold leading-tight mb-2">
          {{ title }}
        </h3>

        <!-- extracto -->
        <p class="text-sm text-muted-foreground line-clamp-2 mb-3">
          {{ excerpt }}
        </p>

        <!-- tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge v-for="t in tags" :key="t" variant="secondary">
            {{ t }}
          </Badge>
        </div>
      </div>

      <!-- acciones -->
      <div class="flex items-center gap-2">
        <Button size="sm" @click="$emit('read')">Leer artículo</Button>
        <Button size="sm" variant="ghost" @click="$emit('share')">
          Compartir
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  cover: string
  title: string
  excerpt: string
  authorName: string
  authorAvatar: string
  publishedAt: string // formato legible, ej. "12 ene 2026"
  tags: string[]
}>()

defineEmits<{
  read: []
  share: []
}>()
</script>

<style scoped>
/* tailwind plugin line-clamp (ya viene con @tailwindcss/typography) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>