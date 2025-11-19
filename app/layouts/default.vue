<template>
  <div class="min-h-screen flex flex-col bg-background">
    <LayoutMainHeader />
    
    <main class="flex-1">
      <slot />
    </main>

    <LayoutMainFooter />
  </div>
</template>

<script setup>
// Este layout se aplicará automáticamente a todas las páginas
</script>