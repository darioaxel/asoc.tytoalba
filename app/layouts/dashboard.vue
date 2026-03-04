<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import DynamicBreadCrumb from '@/components/layout/dashboard/DynamicBreadCrumb.vue'
import { useAppUserSession } from '@/composables/useAppUserSession'
import { Users, Home } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth'], // usa app/middleware/auth.ts
})

const { session } = useAppUserSession()
const isAdmin = computed(() => {
  const role = session.value.role
  return role === 'ADMIN' || role === 'ROOT'
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadCrumb :url="useRoute().path" />          
        </div>
        <div class="flex items-center gap-2 px-4">
          <!-- Enlaces de Admin -->
          <template v-if="isAdmin">
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/socios" class="flex items-center gap-1.5">
                <Home class="h-4 w-4" />
                <span class="hidden sm:inline">Dashboard</span>
              </NuxtLink>
            </Button>
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/socios/lista" class="flex items-center gap-1.5">
                <Users class="h-4 w-4" />
                <span class="hidden sm:inline">Socios</span>
              </NuxtLink>
            </Button>
            <Separator orientation="vertical" class="h-4 mx-1" />
          </template>
          <ThemeToggle />
        </div>
      </header>
      <main class="flex-1 p-4">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
  <LayoutMainFooter />
</template>
