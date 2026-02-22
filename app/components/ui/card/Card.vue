<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-md shadow-gray-200/50 dark:shadow-none dark:border-slate-700/50',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
