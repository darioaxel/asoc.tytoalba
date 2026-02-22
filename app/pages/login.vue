<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const { loggedIn, fetch } = useUserSession()

// Si ya está logueado, redirigimos desde aquí también
if (loggedIn.value) {
  navigateTo('/protected')
}

const loginUser = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    // refrescamos la sesión en el cliente
    await fetch()

    navigateTo('/protected')
  } catch (error) {
    errorMessage.value = error?.data?.message || 'Credenciales incorrectas'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
        <CardDescription class="text-center">
          Introduce tus credenciales para acceder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="loginUser" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="tu@email.com" 
              required
              :disabled="isLoading"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Contraseña</Label>
            <Input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              required
              :disabled="isLoading"
            />
          </div>
          
          <Alert v-if="errorMessage" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            class="w-full" 
            variant="gradient"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col gap-4">
        <div class="text-sm text-center text-muted-foreground">
          ¿No tienes cuenta? 
          <NuxtLink to="/register" class="text-primary hover:underline">
            Regístrate
          </NuxtLink>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
