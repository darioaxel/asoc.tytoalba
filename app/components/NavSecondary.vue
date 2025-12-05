<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next"
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
    </SidebarGroupContent>
  </SidebarGroup>
</template>
