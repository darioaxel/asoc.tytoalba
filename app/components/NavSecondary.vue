<script setup lang="ts">
import { LogOutIcon, type LucideIcon } from "lucide-vue-next"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
}

defineProps<{ items: NavItem[] }>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton as-child>
            <a :href="item.url">     
              <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
              {{ item.title }}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
      <Button        
        class="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
        size="sm"
      >
        <LogOutIcon class="h-4 w-4" />
        Desconectarse
      </Button>
    </SidebarGroupContent>
  </SidebarGroup>
</template>