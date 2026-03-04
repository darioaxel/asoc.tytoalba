<template>
  <footer class="w-full border-t bg-background py-3">
    <div class="container mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-foreground">Tyto Alba</span>
        <span class="hidden sm:inline">© {{ new Date().getFullYear() }}</span>
      </div>
      
      <div class="flex items-center gap-4">
        <NuxtLink to="/contacto" class="hover:text-foreground transition-colors">
          Contacto
        </NuxtLink>
        <span class="hidden sm:inline text-border">|</span>
        <NuxtLink to="/nosotros" class="hidden sm:inline hover:text-foreground transition-colors">
          Nosotros
        </NuxtLink>
        <a 
          href="https://instagram.com/asoc.tytoalba" 
          target="_blank" 
          rel="noopener"
          class="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Instagram class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">@tytoalba</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Instagram } from 'lucide-vue-next'
</script>
