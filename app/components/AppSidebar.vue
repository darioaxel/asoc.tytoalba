<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'


import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { siteConfig } from '@/lib/config'
const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})
const { user } = await useUserSession()

const user_data = computed(() => ({
  name: user.value?.name || siteConfig.user.name,
  email: user.value?.email || siteConfig.user.email,
  avatar: user.value?.avatar || siteConfig.user.avatar
}))

const user_role = computed(() => user.value?.role || 'none')

// Filtrar secciones visibles según auth/roles
const visibleSections = computed(() => {
  return siteConfig.navSections.filter(section => {
    console.log('Evaluando sección:', user_role)    // Si no hay usuario logeado, no visible
    if (user_role.value === 'none') return false
    
    // Si tiene roles específicos, verificar pertenencia
    if (section.roles && section.roles.length > 0) {
      return section.roles.includes(user_role.value)
    }
    
    // Requiere auth pero sin roles específicos → visible para cualquier usuario logeado
    return true
 })
})


const teams = siteConfig.teams

</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="teams" />
    </SidebarHeader>
    <SidebarContent>
       <!-- Renderizar un NavMain por cada sección visible -->
      <NavMain 
        v-for="section in visibleSections" 
        :key="section.title"
        :title="section.title"
        :items="section.items"
      />    
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user_data" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
