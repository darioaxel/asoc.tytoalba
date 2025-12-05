<script setup lang="ts">
import { siteConfig } from '@/lib/config'
import type { LucideIcon } from "lucide-vue-next"
import { ChevronsUpDown } from "lucide-vue-next"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
}

defineProps<{
  items: NavItem[]
}>()

const { user } = await useUserSession()
const user_data = computed(() => ({
  name: user.value?.name || siteConfig.user.name,
  email: user.value?.email || siteConfig.user.email,
  avatar: user.value?.avatar || siteConfig.user.avatar
}))

const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu> 
    <SidebarMenuItem>    
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user_data.avatar" :alt="user_data.name" />
              <AvatarFallback class="rounded-lg">
                CN
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">             
              <span class="truncate font-medium">{{ user_data.name }}</span>
              <span class="truncate text-xs">{{ user_data.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user_data.avatar" :alt="user_data.name" />
                <AvatarFallback class="rounded-lg">
                  CN
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user_data.name }}</span>
                <span class="truncate text-xs">{{ user_data.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />                   
          <DropdownMenuGroup v-for="item in items"
          :key="item.label">            
            <DropdownMenuItem as-child>
               <a :href="item.href">     
              <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </a>
               
            </DropdownMenuItem>            
          </DropdownMenuGroup>
          <DropdownMenuSeparator />          
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
