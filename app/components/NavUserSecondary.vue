<script setup lang="ts">

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
}

defineProps<{ items: NavItem[] }>()
</script>

<template>
       
    <div v-for="item in items" :key="item.title">
        <DropdownMenuItem>
            <a :href="item.url">     
              <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
              {{ item.title }}
            </a>
        </DropdownMenuItem>        
    </div>
</template>