<script setup>
definePageMeta({
  middleware: ['auth'], // usa app/middleware/auth.ts
})

const { user, loggedIn } = useUserSession()
const logout = async () => {
  // Llamamos a la API para cerrar sesión en el backend
  await $fetch('/api/auth/logout', { method: 'POST' })

  // Borramos la sesión del lado del cliente (auth-utils)
  await clearUserSession()
  await fetch()
  // Redirigimos al login
  return navigateTo('/login')
}
</script>

<template>
  <div>
    <h1>Página protegida</h1>
    <p>Bienvenido: {{ user?.email }}</p>
    <p>Rol: {{ user?.role }}</p>
  </div>
  <button
      @click="logout"
      class="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
</template>