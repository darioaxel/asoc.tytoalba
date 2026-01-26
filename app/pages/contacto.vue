<!-- pages/contacto.vue -->
<template>
  <div class="max-w-4xl mx-auto px-6 py-10 space-y-12">
    <!-- Header -->
    <header class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Contacta con nosotros</h1>
      <p class="text-lg text-muted-foreground">
        ¿Tienes dudas? ¿Quieres hacerte socio? Escríbenos y te responderemos enseguida
      </p>
    </header>

    <!-- Grid de información y formulario -->
    <div class="grid lg:grid-cols-2 gap-8">
      
      <!-- Información de contacto -->
      <Card class="p-6 space-y-6">
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold">Datos de contacto</h2>
          <p class="text-muted-foreground">Puedes contactar con nosotros por estos medios:</p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <Icon name="lucide:mail" class="h-5 w-5 text-primary" />
            <div>
              <p class="font-medium">Correo electrónico</p>
              <a href="mailto:asoc.tytoalba@gmail.com" class="text-sm text-muted-foreground hover:text-primary">
                asoc.tytoalba[@]gmail.com
              </a>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Icon name="lucide:phone" class="h-5 w-5 text-primary" />
            <div>
              <p class="font-medium">Teléfono</p>
              <a href="tel:+34xxx111111" class="text-sm text-muted-foreground hover:text-primary">
                XXXXXXXX
              </a>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Icon name="lucide:map-pin" class="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p class="font-medium">Dirección</p>
              <p class="text-sm text-muted-foreground">
                C/ San Cristobal, 13<br>
                13300 Valdepeñas<br>
                Ciudad Real – Spain
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Icon name="lucide:clock" class="h-5 w-5 text-primary" />
            <div>
              <p class="font-medium">Horario de atención</p>
              <p class="text-sm text-muted-foreground">
                Lunes a viernes: 17:00 - 21:00<br>
                Sábados: 10:00 - 14:00
              </p>
            </div>
          </div>
        </div>

        <!-- Redes sociales -->
        <div class="pt-4 border-t">
          <p class="font-medium mb-3">Síguenos en redes</p>
          <div class="flex gap-3">
            <Button size="icon" variant="outline" as-child>
              <a href="https://www.facebook.com/tytoalba" target="_blank" rel="noopener noreferrer">
                <Icon name="lucide:facebook" class="h-4 w-4" />
              </a>
            </Button>
            <Button size="icon" variant="outline" as-child>
              <a href="https://www.instagram.com/tytoalba" target="_blank" rel="noopener noreferrer">
                <Icon name="lucide:instagram" class="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      <!-- Formulario de contacto -->
      <Card class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold">Formulario de contacto</h2>
            <p class="text-sm text-muted-foreground">Rellena el formulario y te responderemos lo antes posible</p>
          </div>

          <!-- Nombre -->
          <div class="space-y-2">
            <Label for="name">Nombre completo *</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Juan García"
              required
            />
            <span v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</span>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <Label for="email">Correo electrónico *</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="juan@example.com"
              required
            />
            <span v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</span>
          </div>

          <!-- Teléfono -->
          <div class="space-y-2">
            <Label for="phone">Teléfono</Label>
            <Input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="600 123 456"
            />
          </div>

          <!-- Asunto -->
          <div class="space-y-2">
            <Label for="subject">Asunto *</Label>
            <Select v-model="form.subject" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un asunto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informacion">Información general</SelectItem>
                <SelectItem value="socio">Hacerme socio</SelectItem>
                <SelectItem value="instalaciones">Reserva de instalaciones</SelectItem>
                <SelectItem value="actividades">Actividades y eventos</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            <span v-if="errors.subject" class="text-sm text-destructive">{{ errors.subject }}</span>
          </div>

          <!-- Mensaje -->
          <div class="space-y-2">
            <Label for="message">Mensaje *</Label>
            <Textarea
              id="message"
              v-model="form.message"
              placeholder="Cuéntanos en qué podemos ayudarte..."
              class="min-h-[120px]"
              required
            />
            <span v-if="errors.message" class="text-sm text-destructive">{{ errors.message }}</span>
          </div>

          <!-- Botón enviar -->
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <Icon v-if="isSubmitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
          </Button>

          <!-- Mensaje de éxito -->
          <Alert v-if="submitSuccess" variant="default">
            <Icon name="lucide:circle-check" class="h-4 w-4" />
            <AlertTitle>¡Mensaje enviado!</AlertTitle>
            <AlertDescription>
              Hemos recibido tu mensaje y te responderemos en breve.
            </AlertDescription>
          </Alert>

          <!-- Mensaje de error -->
          <Alert v-if="submitError" variant="destructive">
            <Icon name="lucide:circle-x" class="h-4 w-4" />
            <AlertTitle>Error al enviar</AlertTitle>
            <AlertDescription>
              {{ submitError }}
            </AlertDescription>
          </Alert>
        </form>
      </Card>
    </div>

    <!-- Mapa (opcional) -->
    <Card class="mt-8">
      <CardHeader>
        <CardTitle>¿Dónde encontrarnos?</CardTitle>
        <CardDescription>Visítanos en nuestras instalaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="aspect-video rounded-lg overflow-hidden bg-muted">
          <!-- Aquí puedes integrar Google Maps o un iframe -->
          <div class="w-full h-full flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <Icon name="lucide:map-pin" class="h-12 w-12 mb-2" />
              <p class="font-medium">C/ San Cristobal, 13</p>
              <p class="text-sm">13300 Valdepeñas, Ciudad Real</p>
              <Button variant="link" as-child class="mt-2">
                <a href="https://maps.google.com/?q=Calle+la+iglesia,+s/n,+24414+Palacios+de+Compludo,+León" target="_blank" rel="noopener noreferrer">
                  Ver en Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Estado del formulario
const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

// Esquema de validación
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Introduce un email válido'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecciona un asunto'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
})

// Enviar formulario
async function onSubmit() {
  // Limpiar errores previos
  Object.keys(errors).forEach(key => delete errors[key])
  submitError.value = ''

  try {
    // Validar
    contactSchema.parse(form)
    
    isSubmitting.value = true

    // Enviar email (aquí iría tu lógica de envío)
    // Por ahora simulamos un envío exitoso
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Éxito
    submitSuccess.value = true
    // Limpiar formulario
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Mostrar errores de validación
      error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })
    } else {
      // Error general
      submitError.value = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useHead({
  title: 'Contacto - Asociación Tyto Alba',
  meta: [
    { name: 'description', content: 'Ponte en contacto con la Asociación Tyto Alba. Formulario de contacto, teléfono, email y dirección.' }
  ]
})
</script>