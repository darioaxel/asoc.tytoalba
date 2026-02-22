<script setup lang="ts">
const colorMode = useColorMode()

const logoSrc = computed(() => {
  return colorMode.value === 'dark' 
    ? '/images/logo-f1-white.png' 
    : '/images/logo-f1.png'
})
</script>

<template>
  <img 
    :src="logoSrc" 
    alt="Logo Tyto Alba" 
    class="h-10 w-auto transition-opacity duration-200" 
  />
</template>
