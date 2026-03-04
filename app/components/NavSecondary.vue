<script setup lang="ts">
import { LogOutIcon, type LucideIcon } from "lucide-vue-next"
import { Icon } from '#components'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'


interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
}

defineProps<{ items: NavItem[] }>()
const { clear } = useUserSession()

async function onLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }) // clearUserSession
  await clear()        // user → null, loggedIn → false 
  await navigateTo('/') 
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton as-child :tooltip="item.title">
            <NuxtLink :to="item.url">
              <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
              <span class="group-data-[collapsible=icon]:hidden">{{ item.title }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
      <SidebarMenuButton 
        class="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
        @click="onLogout"
        tooltip="Desconectarse"
      >
        <LogOutIcon class="h-4 w-4" />
        <span class="group-data-[collapsible=icon]:hidden">Desconectarse</span>
      </SidebarMenuButton>
    </SidebarGroupContent>
  </SidebarGroup>
</template>