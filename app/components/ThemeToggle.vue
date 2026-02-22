<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleTheme"
    class="relative h-9 w-9 rounded-md"
  >
    <Sun 
      class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
    />
    <Moon 
      class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
