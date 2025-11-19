<script setup>
definePageMeta({
  middleware: ['auth'],
  roles: ["ROOT"]
})
</script>
<template>
  <h1>Panel root</h1>
</template>
