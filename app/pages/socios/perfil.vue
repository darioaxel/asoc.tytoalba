<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

const { user } = await useUserSession()
const router = useRouter()
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
import { toast } from 'vue-sonner'
import { Pencil, LogOut, Loader2 } from 'lucide-vue-next'

// Formulario con datos del usuario
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dni: '',
  birthDate: '',
  addressLine: '',
  floorDoor: '',
  postalCode: '',
  locality: '',
  province: '',  
})

// Cargar datos del usuario logueado
const loadUserData = async () => {
  console.log('📋 Cargando datos para usuario:', user.value?.id)

  try {
    const data = await $fetch('/api/user/profile')
    console.log('✅ Datos recibidos:', data)
    
    // Asignar datos al formulario
    Object.assign(form, data)
    
  } catch (error: any) {
    console.error('❌ Error al cargar datos:', error)
    toast.error('Error al cargar datos del perfil')
    
    if (error.statusCode === 401) {
      await router.push('/socios/login')
    }
  } finally {
    isLoading.value = false
  }
}
// Activar modo edición
const startEdit = () => {
  isEditing.value = true
}

// Cancelar edición
const cancelEdit = () => {
  isEditing.value = false
  loadUserData() // Recargar datos originales
}

// Guardar cambios
const saveProfile = async () => {
  isSaving.value = true
  try {
    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: form
    })
    
    await refresh() // Actualizar sesión
    toast.success('Perfil actualizado')
    isEditing.value = false
    
  } catch (error: any) {
    toast.error(error.data?.message || 'Error al guardar')
  } finally {
    isSaving.value = false
  }
}

// Cerrar sesión
const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clearUserSession()
  await router.push('/socios/login')
}

// Cargar datos al montar
onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-4xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Mi Perfil</h1>
      <div class="space-x-4">
        <Button 
          v-if="!isEditing" 
          @click="startEdit" 
          variant="outline"
        >
          <Pencil class="w-4 h-4 mr-2" />
          Editar perfil
        </Button>
        <Button 
          variant="outline" 
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin" />
    </div>

    <!-- Formulario -->
    <Card v-else>
      <CardHeader>
        <CardTitle>Información personal</CardTitle>
        <CardDescription>
          Datos de tu cuenta en la asociación
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form @submit.prevent="saveProfile">
          <FieldGroup>
            <!-- Datos personales -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Nombre</FieldLabel>
                <Input 
                  v-model="form.firstName" 
                  :disabled="!isEditing"
                  placeholder="Tu nombre"
                />
              </Field>

              <Field>
                <FieldLabel>Apellidos</FieldLabel>
                <Input 
                  v-model="form.lastName" 
                  :disabled="!isEditing"
                  placeholder="Tus apellidos"
                />
              </Field>
            </div>

            <!-- Email ancho completo -->
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input 
                v-model="form.email" 
                type="email"
                :disabled="!isEditing"
                placeholder="tu@email.com"
              />
              <FieldDescription>
                Usamos este email para contactarte
              </FieldDescription>
            </Field>

            <!-- Documentación -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>DNI</FieldLabel>
                <Input 
                  v-model="form.dni" 
                  :disabled="!isEditing"
                  placeholder="12345678A"
                />
              </Field>

              <Field>
                <FieldLabel>Teléfono</FieldLabel>
                <Input 
                  v-model="form.phone" 
                  type="tel"
                  :disabled="!isEditing"
                  placeholder="612345678"
                />
              </Field>

              <Field>
                <FieldLabel>Fecha de nacimiento</FieldLabel>
                <Input 
                  v-model="form.birthDate" 
                  type="date"
                  :disabled="!isEditing"
                />
              </Field>
            </div>

            <!-- Dirección -->
            <div class="border rounded-lg p-4 mt-4">
              <h3 class="text-lg font-medium mb-4">Dirección</h3>
              
              <Field>
                <FieldLabel>Dirección</FieldLabel>
                <Input 
                  v-model="form.addressLine" 
                  :disabled="!isEditing"
                  placeholder="Calle Mayor 123"
                />
              </Field>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field>
                  <FieldLabel>Piso/Puerta</FieldLabel>
                  <Input 
                    v-model="form.floorDoor" 
                    :disabled="!isEditing"
                    placeholder="2º B"
                  />
                </Field>

                <Field>
                  <FieldLabel>Código postal</FieldLabel>
                  <Input 
                    v-model="form.postalCode" 
                    :disabled="!isEditing"
                    placeholder="28001"
                  />
                </Field>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Field>
                  <FieldLabel>Localidad</FieldLabel>
                  <Input 
                    v-model="form.locality" 
                    :disabled="!isEditing"
                    placeholder="Madrid"
                  />
                </Field>

                <Field>
                  <FieldLabel>Provincia</FieldLabel>
                  <Input 
                    v-model="form.province" 
                    :disabled="!isEditing"
                    placeholder="Madrid"
                  />
                </Field>             
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-end gap-4 mt-6">
              <Button 
                v-if="isEditing" 
                type="button"
                variant="outline" 
                @click="cancelEdit"
              >
                Cancelar
              </Button>
              
              <Button 
                v-if="isEditing" 
                type="submit"
                :disabled="isSaving"
              >
                <Loader2 v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" />
                {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>