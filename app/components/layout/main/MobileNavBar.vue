<template>
  <Sheet>
    <SheetTrigger as-child class="lg:hidden">
      <Button variant="outline" size="icon" class="border-tyto-primary/50 hover:bg-tyto-primary/10 hover:text-tyto-primary">
        <Icon name="lucide:menu" class="h-6 w-6" />
        <span class="sr-only">Abrir menú</span>
      </Button>
    </SheetTrigger>

    <SheetContent side="right" class="w-80">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2 text-tyto-primary">
          <Icon name="lucide:home" class="w-6 h-6" />
          Menú
        </SheetTitle>
      </SheetHeader>

      <nav class="flex flex-col gap-4">
        <!-- Mobile menu items - same as desktop -->
        <template v-for="item in navItems" :key="item.href">
          <!-- Items with children (Socios dropdown) -->
          <template v-if="item.children?.length">
            <Separator class="my-2" />

            <!-- Parent label -->
            <div class="px-4">
              <p class="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
                {{ item.label }}
              </p>

              <!-- Children links (already filtered) -->
              <NuxtLink v-for="child in item.children" :key="child.href" :to="child.href"
                class="flex items-center gap-3 py-2 text-sm transition-colors hover:text-tyto-primary ml-4"
                :class="{ 'bg-tyto-primary/10 text-tyto-primary rounded-md px-2': isActive(child.href) }">
                <Icon v-if="child.icon" :name="child.icon" class="h-4 w-4" />
                {{ child.label }}
              </NuxtLink>
            </div>
          </template>

          <!-- Regular items without children -->
          <NuxtLink v-else :to="item.href"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary"
            :class="{ 'bg-tyto-primary/10 text-tyto-primary': isActive(item.href) }">
            <Icon v-if="item.icon" :name="item.icon" class="h-5 w-5" />
            <span class="font-medium">{{ item.label }}</span>
          </NuxtLink>
        </template>

        <!-- Auth section separator -->
        <Separator />
      
        <!-- Authentication buttons - same as desktop -->
        <template v-if="!loggedIn">
          <NuxtLink to="/socios/login" class="w-3/4 mx-auto">
            <Button class="w-full bg-tyto-primary hover:bg-tyto-primary/90">
              <Icon name="lucide:log-in" class="mr-2 h-4 w-4" />
              Login
            </Button>
          </NuxtLink>
        </template>

        <template v-else>
          <NuxtLink to="/socios/" class="w-3/4 mx-auto">
            <Button class="w-full bg-tyto-primary hover:bg-tyto-primary/90">
              <Icon name="lucide:user" class="mr-2 h-4 w-4" />
              Mi Área
            </Button>
          </NuxtLink>

          <Button variant="outline" class="w-3/4 mx-auto" @click="$emit('logout')">
            <Icon name="lucide:log-out" class="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </template>
      </nav>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { useRoute } from '#app'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Icon } from '#components'

interface Props {
  navItems: any[]
  loggedIn: boolean
}

defineProps<Props>()
defineEmits(['logout'])

const route = useRoute()
const isActive = (path: string) => route.path === path
</script>