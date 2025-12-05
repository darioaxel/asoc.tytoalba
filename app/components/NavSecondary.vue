<script setup lang="ts">
import { LogOutIcon, type LucideIcon } from "lucide-vue-next"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
}

const logout = async () => {
  // Llamamos a la API para cerrar sesión en el backend
  await $fetch('/api/auth/logout', { method: 'POST' })

  // Borramos la sesión del lado del cliente (auth-utils)
  await clearUserSession()
  await fetch()
  // Redirigimos al login
  return navigateTo('/')
}

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem
          v-for="item in items"
          :key="item.label"
        >
          <SidebarMenuButton as-child>
            <a :href="item.href">     
              <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
       <Button
            @click="logout"
            class="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
            size="sm"
          >
            <LogOutIcon class="h-4 w-4" />
            Desconectarse
          </Button>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
