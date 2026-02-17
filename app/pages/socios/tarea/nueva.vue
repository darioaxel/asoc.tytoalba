<template>
  <div class="max-w-4xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Nueva Tarea</h1>
        <p class="text-muted-foreground mt-1">
          Crea una nueva tarea y asígnala a los socios
        </p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/socios/tareas">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a tareas
        </NuxtLink>
      </Button>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la tarea</CardTitle>
          <CardDescription>
            Completa los datos básicos de la tarea
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Título / Descripción breve -->
          <div class="space-y-2">
            <Label for="shortDesc">Título *</Label>
            <Input
              id="shortDesc"
              v-model="form.shortDesc"
              placeholder="Ej: Organizar excursión al rocódromo"
              maxlength="255"
              required
            />
          </div>

          <!-- Tipo de tarea -->
          <div class="space-y-2">
            <Label for="type">Tipo *</Label>
            <Select v-model="form.type" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de tarea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROPUESTA">Propuesta</SelectItem>
                <SelectItem value="IMPORTANTE">Importante</SelectItem>
                <SelectItem value="URGENTE">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Descripción detallada -->
          <div class="space-y-2">
            <Label for="longDesc">Descripción detallada</Label>
            <Textarea
              id="longDesc"
              v-model="form.longDesc"
              placeholder="Describe los detalles de la tarea, objetivos, requisitos..."
              rows="5"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Asignación -->
      <Card>
        <CardHeader>
          <CardTitle>Asignación</CardTitle>
          <CardDescription>
            Selecciona quién realizará la tarea
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Asignados -->
          <div class="space-y-2">
            <Label>Asignados *</Label>
            <div v-if="loadingUsers" class="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="lucide:loader-2" class="h-4 w-4 animate-spin" />
              Cargando usuarios...
            </div>
            <div v-else class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="user in selectedUsers"
                  :key="user.id"
                  variant="secondary"
                  class="cursor-pointer hover:bg-destructive/20"
                  @click="removeAssignee(user.id)"
                >
                  {{ getFullName(user) }}
                  <Icon name="lucide:x" class="ml-1 h-3 w-3" />
                </Badge>
                <span v-if="selectedUsers.length === 0" class="text-sm text-muted-foreground">
                  No hay asignados seleccionados
                </span>
              </div>
              <Select v-model="selectedAssignee">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Añadir asignado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="user in availableUsers"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ getFullName(user) }} ({{ user.email }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Documentos -->
      <Card>
        <CardHeader>
          <CardTitle>Documentos adjuntos</CardTitle>
          <CardDescription>
            Añade documentos PDF o imágenes relacionados con la tarea (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Lista de archivos seleccionados -->
          <div v-if="selectedFiles.length > 0" class="space-y-2">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <Icon 
                  :name="file.type.startsWith('image/') ? 'lucide:image' : 'lucide:file-text'" 
                  class="h-5 w-5 text-muted-foreground" 
                />
                <div>
                  <p class="text-sm font-medium truncate max-w-[300px]">{{ file.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="removeFile(index)"
              >
                <Icon name="lucide:x" class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Input de archivos -->
          <div class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              class="hidden"
              @change="handleFileSelect"
            />
            <Icon name="lucide:upload-cloud" class="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p class="text-sm text-muted-foreground mb-2">
              Arrastra archivos aquí o
              <button
                type="button"
                class="text-primary hover:underline font-medium"
                @click="fileInput?.click()"
              >
                selecciona archivos
              </button>
            </p>
            <p class="text-xs text-muted-foreground">
              PDF, JPG, PNG o WebP • Máx. 10MB por archivo
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Fechas -->
      <Card>
        <CardHeader>
          <CardTitle>Fechas</CardTitle>
          <CardDescription>
            Define el plazo para completar la tarea
          </CardDescription>
        </CardHeader>
        <CardContent class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="startDate">Fecha de inicio</Label>
            <Input
              id="startDate"
              v-model="form.startDate"
              type="date"
            />
          </div>
          <div class="space-y-2">
            <Label for="endDate">Fecha de fin estimada</Label>
            <Input
              id="endDate"
              v-model="form.endDate"
              type="date"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Botones -->
      <div class="flex gap-4 pt-4">
        <Button
          type="submit"
          :disabled="isSubmitting || selectedUsers.length === 0 || !form.shortDesc || !form.type"
          class="flex-1"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:plus" class="mr-2 h-4 w-4" />
          {{ isSubmitting ? 'Creando...' : 'Crear tarea' }}
        </Button>
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/socios/tareas">
            Cancelar
          </NuxtLink>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Icon } from '#components'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

definePageMeta({
  middleware: ['ADMIN', 'ROOT'],
  layout: 'dashboard',
})

interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
}

// Formulario
const form = ref({
  shortDesc: '',
  longDesc: '',
  type: 'PROPUESTA' as 'PROPUESTA' | 'IMPORTANTE' | 'URGENTE',
  startDate: '',
  endDate: '',
})

const selectedUsers = ref<User[]>([])
const selectedAssignee = ref('')
const isSubmitting = ref(false)

// Archivos
const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()

// Datos de usuarios
const users = ref<User[]>([])
const loadingUsers = ref(true)

// Cargar usuarios
const fetchUsers = async () => {
  try {
    const data = await $fetch<User[]>('/api/users')
    users.value = data
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    toast.error('Error', { description: 'No se pudieron cargar los usuarios' })
  } finally {
    loadingUsers.value = false
  }
}

// Usuarios disponibles (no seleccionados aún)
const availableUsers = computed(() => {
  const selectedIds = selectedUsers.value.map(u => u.id)
  return users.value.filter(u => !selectedIds.includes(u.id))
})

// Añadir asignado
watch(selectedAssignee, (userId) => {
  if (!userId) return
  const user = users.value.find(u => u.id === userId)
  if (user && !selectedUsers.value.find(u => u.id === userId)) {
    selectedUsers.value.push(user)
  }
  selectedAssignee.value = ''
})

// Eliminar asignado
const removeAssignee = (userId: string) => {
  selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)
}

// Manejar selección de archivos
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  for (const file of Array.from(files)) {
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo no permitido', {
        description: `${file.name} no es un PDF o imagen válida`
      })
      continue
    }
    if (file.size > maxSize) {
      toast.error('Archivo demasiado grande', {
        description: `${file.name} supera los 10MB`
      })
      continue
    }
    selectedFiles.value.push(file)
  }

  // Limpiar input
  target.value = ''
}

// Eliminar archivo
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// Formatear tamaño de archivo
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Helpers
const getFullName = (user: User) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user.email
}

// Subir archivos
const uploadFiles = async (): Promise<string[]> => {
  if (selectedFiles.value.length === 0) return []
  
  const uploadedIds: string[] = []
  
  for (const file of selectedFiles.value) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await $fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      uploadedIds.push(response.id)
    } catch (error) {
      console.error('Error subiendo archivo:', error)
      toast.error('Error', { description: `No se pudo subir ${file.name}` })
    }
  }
  
  return uploadedIds
}

// Enviar formulario
const handleSubmit = async () => {
  if (selectedUsers.value.length === 0) {
    toast.error('Error', { description: 'Debes seleccionar al menos un asignado' })
    return
  }

  isSubmitting.value = true
  
  try {
    // Subir archivos primero
    const documentIds = await uploadFiles()

    const payload = {
      shortDesc: form.value.shortDesc,
      longDesc: form.value.longDesc || undefined,
      type: form.value.type,
      assigneeIds: selectedUsers.value.map(u => u.id),
      documentIds: documentIds.length > 0 ? documentIds : undefined,
      startDate: form.value.startDate || undefined,
      endDate: form.value.endDate || undefined,
    }

    await $fetch('/api/tasks', {
      method: 'POST',
      body: payload
    })

    toast.success('Tarea creada', {
      description: 'La tarea ha sido creada exitosamente'
    })

    navigateTo('/socios/tareas')
    
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo crear la tarea'
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
