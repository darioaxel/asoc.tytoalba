<!-- components/BlogPostSkeleton.vue -->
<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <div v-for="i in 3" :key="i" class="h-6 bg-muted rounded-full animate-pulse w-16" />
      </div>
      
      <div class="h-12 bg-muted rounded animate-pulse w-3/4" />
      <div class="h-6 bg-muted rounded animate-pulse w-full" />
      
      <!-- Meta -->
      <div class="flex items-center gap-4">
        <div class="h-8 w-8 bg-muted rounded-full animate-pulse" />
        <div class="h-4 bg-muted rounded animate-pulse w-24" />
        <div class="h-4 bg-muted rounded animate-pulse w-32" />
      </div>
    </header>

    <!-- Cover -->
    <div class="h-64 bg-muted rounded-lg animate-pulse" />

    <!-- Content -->
    <div class="space-y-4">
      <div v-for="i in 8" :key="i" class="h-4 bg-muted rounded animate-pulse" :class="i % 4 === 0 ? 'w-3/4' : 'w-full'" />
    </div>
  </div>
</template>