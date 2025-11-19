<script setup>
definePageMeta({
  middleware: ['auth'], // usa app/middleware/auth.ts
  roles: ["ADMIN", "ROOT"]
})
</script>

<template>
  <h1>Panel admin</h1>
</template>