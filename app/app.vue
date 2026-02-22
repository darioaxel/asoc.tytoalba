<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

const colorMode = useColorMode()
</script>

<template>  
  <div :class="colorMode.value">
    <NuxtLayout>
      <NuxtPage />    
    </NuxtLayout>
    <Toaster />
  </div>
</template>
