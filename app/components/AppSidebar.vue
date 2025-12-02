<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'


import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
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

const user_data = siteConfig.user
const nav_main = siteConfig.navMain
const projects = siteConfig.projects
const teams = siteConfig.teams

</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="nav_main" />
      <NavProjects :projects="projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user_data" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
