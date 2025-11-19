<script setup>
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const { loggedIn, fetch } = useUserSession()

// Si ya está logueado, redirigimos desde aquí también
if (loggedIn.value) {
  navigateTo('/protected')
}

const loginUser = async () => {
  errorMessage.value = ''

  const { error } = await useFetch('/api/auth/login', {
    method: 'POST',
    body: { email: email.value, password: password.value }
  })

  if (error.value) {
    errorMessage.value = 'Credenciales incorrectas'
    return
  }

  // refrescamos la sesión en el cliente
  await fetch()

  navigateTo('/protected')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl mb-4">Login</h1>

    <form @submit.prevent="loginUser" class="flex flex-col gap-3 w-64">
      <input v-model="email" type="email" placeholder="Email" class="border p-2 rounded" />
      <input v-model="password" type="password" placeholder="Password" class="border p-2 rounded" />
      <button class="bg-blue-600 text-white p-2 rounded">
        Entrar
      </button>
    </form>

    <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
  </div>
</template>
