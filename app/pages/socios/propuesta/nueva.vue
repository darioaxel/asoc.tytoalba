<template>
  <div class="max-w-4xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Nueva Propuesta</h1>
        <p class="text-muted-foreground mt-1">
          Crea una nueva propuesta para la asociación
        </p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/socios/propuestas">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver
        </NuxtLink>
      </Button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Título -->
      <div class="space-y-2">
        <Label for="title">Título <span class="text-red-500">*</span></Label>
        <Input 
          id="title"
          v-model="form.title"
          placeholder="Título de la propuesta"
          :class="{ 'border-red-500': errors.title }"
        />
        <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
      </div>

      <!-- Resumen -->
      <div class="space-y-2">
        <Label for="summary">Resumen <span class="text-red-500">*</span></Label>
        <Textarea 
          id="summary"
          v-model="form.summary"
          placeholder="Breve resumen de la propuesta (visible en el listado)"
          rows="3"
          :class="{ 'border-red-500': errors.summary }"
        />
        <p v-if="errors.summary" class="text-sm text-red-500">{{ errors.summary }}</p>
      </div>

      <!-- Descripción completa -->
      <div class="space-y-2">
        <Label for="description">Descripción completa <span class="text-red-500">*</span></Label>
        <Textarea 
          id="description"
          v-model="form.description"
          placeholder="Descripción detallada de la propuesta"
          rows="8"
          :class="{ 'border-red-500': errors.description }"
        />
        <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
      </div>

      <!-- Fechas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="startDate">Fecha de inicio / realización</Label>
          <Input 
            id="startDate"
            v-model="form.startDate"
            type="date"
          />
          <p class="text-xs text-muted-foreground">
            Fecha en la que se llevaría a cabo la propuesta
          </p>
        </div>

        <div class="space-y-2">
          <Label for="endDate">Fecha de finalización de votación</Label>
          <Input 
            id="endDate"
            v-model="form.endDate"
            type="date"
          />
          <p class="text-xs text-muted-foreground">
            Fecha límite para votar (mensual por defecto)
          </p>
        </div>
      </div>

      <!-- Responsables adicionales -->
      <div class="space-y-2">
        <Label>Responsables adicionales</Label>
        <div class="border rounded-md p-4 space-y-3">
          <div v-if="loadingUsers" class="text-sm text-muted-foreground">
            Cargando usuarios...
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div 
              v-for="user in availableUsers" 
              :key="user.id"
              class="flex items-center space-x-2"
            >
              <Checkbox 
                :id="`user-${user.id}`"
                :checked="form.responsibleIds.includes(user.id)"
                @update:checked="toggleResponsible(user.id)"
              />
              <Label :for="`user-${user.id}`" class="text-sm cursor-pointer">
                {{ user.firstName }} {{ user.lastName }}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <!-- Imágenes -->
      <div class="space-y-2">
        <Label>Imágenes</Label>
        <div class="border rounded-md p-4">
          <div class="flex items-center gap-4">
            <Input 
              ref="imageInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleImageUpload"
            />
            <Button type="button" variant="outline" @click="$refs.imageInput.click()">
              <Icon name="lucide:image-plus" class="mr-2 h-4 w-4" />
              Seleccionar imágenes
            </Button>
            <span class="text-sm text-muted-foreground">
              {{ form.images.length }} imagen(es) seleccionada(s)
            </span>
          </div>
          
          <!-- Preview de imágenes -->
          <div v-if="form.images.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4">
            <div 
              v-for="(image, index) in form.images" 
              :key="index"
              class="relative aspect-square rounded-md overflow-hidden border"
            >
              <img 
                :src="image.preview" 
                class="w-full h-full object-cover"
                alt="Preview"
              />
              <button
                type="button"
                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                @click="removeImage(index)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentos -->
      <div class="space-y-2">
        <Label>Documentos adjuntos</Label>
        <div class="border rounded-md p-4">
          <div class="flex items-center gap-4">
            <Input 
              ref="documentInput"
              type="file"
              multiple
              class="hidden"
              @change="handleDocumentUpload"
            />
            <Button type="button" variant="outline" @click="$refs.documentInput.click()">
              <Icon name="lucide:file-plus" class="mr-2 h-4 w-4" />
              Seleccionar documentos
            </Button>
            <span class="text-sm text-muted-foreground">
              {{ form.documents.length }} documento(s) seleccionado(s)
            </span>
          </div>
          
          <!-- Lista de documentos -->
          <div v-if="form.documents.length > 0" class="space-y-2 mt-4">
            <div 
              v-for="(doc, index) in form.documents" 
              :key="index"
              class="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <div class="flex items-center gap-2">
                <Icon name="lucide:file-text" class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm truncate max-w-[200px]">{{ doc.name }}</span>
                <span class="text-xs text-muted-foreground">({{ formatFileSize(doc.size) }})</span>
              </div>
              <button
                type="button"
                class="text-red-500 hover:text-red-700"
                @click="removeDocument(index)"
              >
                <Icon name="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/socios/propuestas">Cancelar</NuxtLink>
        </Button>
        <Button type="submit" :disabled="submitting">
          <Icon v-if="submitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:plus" class="mr-2 h-4 w-4" />
          Crear propuesta
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Icon } from '#components'
import { toast } from 'vue-sonner'
const router = useRouter()

// Estado del formulario
const form = ref({
  title: '',
  summary: '',
  description: '',
  startDate: '',
  endDate: '',
  responsibleIds: [] as string[],
  images: [] as { file: File; preview: string; name: string; size: number }[],
  documents: [] as { file: File; name: string; size: number }[]
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const loadingUsers = ref(false)
const availableUsers = ref<Array<{ id: string; firstName: string; lastName: string }>>([])

// Cargar usuarios disponibles
const fetchUsers = async () => {
  loadingUsers.value = true
  try {
    const { session } = useAppUserSession()
    const currentUserId = session.value.user?.id
    
    const users = await $fetch('/api/users')
    availableUsers.value = users.filter((u: any) => u.id !== currentUserId && u.isActive)
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  } finally {
    loadingUsers.value = false
  }
}

const toggleResponsible = (userId: string) => {
  const index = form.value.responsibleIds.indexOf(userId)
  if (index === -1) {
    form.value.responsibleIds.push(userId)
  } else {
    form.value.responsibleIds.splice(index, 1)
  }
}

// Manejo de imágenes
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  
  Array.from(target.files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.value.images.push({
          file,
          preview: e.target?.result as string,
          name: file.name,
          size: file.size
        })
      }
      reader.readAsDataURL(file)
    }
  })
  
  // Limpiar input
  target.value = ''
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

// Manejo de documentos
const handleDocumentUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  
  Array.from(target.files).forEach(file => {
    form.value.documents.push({
      file,
      name: file.name,
      size: file.size
    })
  })
  
  // Limpiar input
  target.value = ''
}

const removeDocument = (index: number) => {
  form.value.documents.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validación
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'El título es obligatorio'
  }
  
  if (!form.value.summary.trim()) {
    errors.value.summary = 'El resumen es obligatorio'
  }
  
  if (!form.value.description.trim()) {
    errors.value.description = 'La descripción es obligatoria'
  }
  
  return Object.keys(errors.value).length === 0
}

// Subir archivos
const uploadFiles = async (): Promise<{ imageIds: string[]; documentIds: string[] }> => {
  const imageIds: string[] = []
  const documentIds: string[] = []
  
  // Subir imágenes
  for (const image of form.value.images) {
    const formData = new FormData()
    formData.append('file', image.file)
    
    try {
      const result = await $fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      imageIds.push(result.id)
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      throw new Error(`Error al subir la imagen ${image.name}`)
    }
  }
  
  // Subir documentos
  for (const doc of form.value.documents) {
    const formData = new FormData()
    formData.append('file', doc.file)
    
    try {
      const result = await $fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      documentIds.push(result.id)
    } catch (error) {
      console.error('Error subiendo documento:', error)
      throw new Error(`Error al subir el documento ${doc.name}`)
    }
  }
  
  return { imageIds, documentIds }
}

// Enviar formulario
const submitForm = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    // Subir archivos primero
    const { imageIds, documentIds } = await uploadFiles()
    
    // Crear propuesta
    const result = await $fetch('/api/proposals', {
      method: 'POST',
      body: {
        title: form.value.title,
        summary: form.value.summary,
        description: form.value.description,
        startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : undefined,
        endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : undefined,
        responsibleIds: form.value.responsibleIds,
        imageIds,
        documentIds
      }
    })
    
    toast.success('Propuesta creada', {
      description: 'La propuesta ha sido creada exitosamente',
    })
    
    router.push('/socios/propuestas')
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo crear la propuesta',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
