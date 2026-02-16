<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader class="bg-gradient-to-br from-green-500/5 to-emerald-500/5">
      <PageHeaderHeading class="max-w-4xl">
        Hazte Socio
      </PageHeaderHeading>
      <PageHeaderDescription>
        Completa el formulario para solicitar tu inscripción como socio
      </PageHeaderDescription>
    </PageHeader>

    <div class="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserPlus class="w-5 h-5" />
            Solicitud de Inscripción
          </CardTitle>
          <CardDescription>
            Introduce tus datos para que podamos contactar contigo y procesar tu solicitud.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <!-- Nombre -->
              <div class="space-y-2">
                <Label for="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  v-model="form.firstName"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <!-- Apellidos -->
              <div class="space-y-2">
                <Label for="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  v-model="form.lastName"
                  placeholder="Tus apellidos"
                  required
                />
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <Label for="email">Email *</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="tu@email.com"
                required
              />
            </div>

            <!-- Edad -->
            <div class="space-y-2">
              <Label for="age">Edad *</Label>
              <Input
                id="age"
                v-model="form.age"
                type="number"
                min="1"
                max="120"
                placeholder="Tu edad"
                required
              />
              <p v-if="isMinor" class="text-sm text-amber-600 flex items-center gap-1">
                <AlertTriangle class="w-4 h-4" />
                Eres menor de edad. Se requerirá el consentimiento de padre/madre o tutor legal.
              </p>
            </div>

            <!-- Mensaje opcional -->
            <div class="space-y-2">
              <Label for="message">Mensaje (opcional)</Label>
              <Textarea
                id="message"
                v-model="form.message"
                placeholder="Cuéntanos un poco sobre ti, tus intereses en la asociación..."
                rows="4"
              />
            </div>

            <!-- Consentimiento -->
            <div class="flex items-start gap-2">
              <Checkbox
                id="consent"
                v-model:checked="form.consent"
                required
              />
              <Label for="consent" class="text-sm font-normal leading-normal cursor-pointer">
                He leído y acepto la
                <NuxtLink to="/socios/landing" class="text-primary hover:underline">normativa de socios</NuxtLink>
                y el compromiso de hacer frente a las cuotas periódicas.
              </Label>
            </div>

            <Button
              type="submit"
              class="w-full"
              :disabled="isSubmitting || !form.consent"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              <Send v-else class="w-4 h-4 mr-2" />
              {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
            </Button>
          </form>
        </CardContent>

        <CardFooter class="flex flex-col items-start gap-2 text-sm text-muted-foreground border-t pt-6">
          <p class="flex items-center gap-2">
            <Info class="w-4 h-4" />
            Recuerda que también deberás enviar por email:
          </p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>Fotografía del DNI (ambas caras)</li>
            <li>Documento de consentimiento firmado (si eres menor)</li>
            <li>Número de cuenta bancaria (IBAN)</li>
          </ul>
          <p class="mt-2">
            Email: <a href="mailto:asoc.tytoalba@gmail.com" class="text-primary hover:underline">asoc.tytoalba@gmail.com</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserPlus,
  Send,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Checkbox } from '~/components/ui/checkbox'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  message: '',
  consent: false
})

const isSubmitting = ref(false)

const isMinor = computed(() => {
  const age = parseInt(form.value.age)
  return age && age < 18
})

async function handleSubmit() {
  if (!form.value.consent) {
    toast.error('Debes aceptar la normativa para continuar.')
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/socios/solicitud', {
      method: 'POST',
      body: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        age: parseInt(form.value.age),
        message: form.value.message
      }
    })

    if (response.success) {
      toast.success('¡Solicitud enviada! Te contactaremos pronto para completar el proceso.')

      // Limpiar formulario
      form.value = {
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        message: '',
        consent: false
      }
    }
  } catch (error: any) {
    toast.error(error.data?.message || 'No se pudo enviar la solicitud. Inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
