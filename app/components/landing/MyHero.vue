<script setup lang="ts">
import { Button } from '@/components/ui/button'

const title = 'The Foundation for your Design System'
const description
  = 'A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,  
})
</script>


<template>
  <div class="flex flex-1 flex-col">
   <PageHeaderHeading class="max-w-4xl">
        {{ title }}
      </PageHeaderHeading>
      <PageHeaderDescription>{{ description }}</PageHeaderDescription>
      <PageActions>
        <Button as-child size="sm">
          <NuxtLink to="/">
            Get Started
          </NuxtLink>
        </Button>
        <Button as-child size="sm" variant="ghost">
          <NuxtLink to="/">
            View Components
          </NuxtLink>
        </Button>
      </PageActions>
      </div>
</template>