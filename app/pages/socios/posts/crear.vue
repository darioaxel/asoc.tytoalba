<template>
  <div class="max-w-2xl mx-auto px-6 py-8 space-y-6">
    <!-- Header con pasos -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Crear Post</h1>
        <p class="text-muted-foreground mt-1">
          Paso 1 de 2: Información básica
        </p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/socios">
          <Icon name="lucide:x" class="mr-2 h-4 w-4" />
          Cancelar
        </NuxtLink>
      </Button>
    </div>

    <!-- Indicador de progreso -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
          1
        </div>
        <span class="font-medium">Datos básicos</span>
      </div>
      <div class="flex-1 h-px bg-border" />
      <div class="flex items-center gap-2 opacity-50">
        <div class="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center font-medium">
          2
        </div>
        <span>Contenido</span>
      </div>
    </div>

    <!-- Formulario Paso 1 -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del post</CardTitle>
          <CardDescription>
            Completa los datos básicos del artículo. Podrás añadir el contenido en el siguiente paso.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Título -->
          <div class="space-y-2">
            <Label for="title">Título *</Label>
            <Input
              id="title"
              v-model="form.title"
              placeholder="Ej: Excursión al rocódromo de Gijón"
              maxlength="200"
              required
              @blur="generateSlugIfEmpty"
            />
          </div>

          <!-- Slug -->
          <div class="space-y-2">
            <Label for="slug">URL amigable (slug) *</Label>
            <Input
              id="slug"
              v-model="form.slug"
              placeholder="ej-excursion-al-rocodromo-de-gijon"
              maxlength="200"
              required
            />
            <p class="text-xs text-muted-foreground">
              Este será el nombre en la URL: /blog/{{ form.slug || 'ejemplo' }}
            </p>
          </div>

          <!-- Descripción breve -->
          <div class="space-y-2">
            <Label for="excerpt">Resumen / Descripción breve</Label>
            <Textarea
              id="excerpt"
              v-model="form.excerpt"
              placeholder="Breve descripción que aparecerá en la lista de posts..."
              rows="3"
              maxlength="500"
            />
            <p class="text-xs text-muted-foreground text-right">
              {{ form.excerpt.length }}/500 caracteres
            </p>
          </div>

          <!-- Imagen destacada con drag/drop -->
          <div class="space-y-2">
            <Label>Imagen de portada</Label>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="hidden"
              @change="handleFileSelect"
            />
            
            <!-- Área de drag & drop -->
            <div
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              ]"
              @click="fileInput?.click()"
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div v-if="form.coverImage" class="space-y-3">
                <img 
                  :src="form.coverImage" 
                  alt="Preview" 
                  class="max-h-40 mx-auto rounded-lg object-cover"
                />
                <p class="text-sm text-muted-foreground">
                  Haz clic o arrastra otra imagen para cambiarla
                </p>
              </div>
              <div v-else class="space-y-2">
                <Icon name="lucide:image-plus" class="h-10 w-10 text-muted-foreground mx-auto" />
                <p class="text-sm text-muted-foreground">
                  <span class="font-medium text-primary">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p class="text-xs text-muted-foreground">
                  JPG, PNG, WebP o GIF • Máx 10MB
                </p>
              </div>
            </div>

            <!-- Input manual de URL -->
            <div class="flex gap-2 mt-2">
              <Input
                v-model="form.coverImage"
                placeholder="O introduce una URL de imagen"
                class="text-sm"
              />
              <Button
                v-if="form.coverImage"
                type="button"
                variant="ghost"
                size="icon"
                @click="form.coverImage = ''"
              >
                <Icon name="lucide:x" class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Categoría -->
          <div class="space-y-2">
            <Label for="category">Categoría</Label>
            <Select v-model="form.category">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excursiones">Excursiones</SelectItem>
                <SelectItem value="rocodromo">Rocódromo</SelectItem>
                <SelectItem value="formacion">Formación</SelectItem>
                <SelectItem value="seguridad">Seguridad</SelectItem>
                <SelectItem value="actualidad">Actualidad</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Tags -->
          <div class="space-y-2">
            <Label>Etiquetas</Label>
            <div class="flex flex-wrap gap-2 mb-2">
              <Badge
                v-for="tag in form.tags"
                :key="tag"
                variant="secondary"
                class="cursor-pointer hover:bg-destructive/20"
                @click="removeTag(tag)"
              >
                {{ tag }}
                <Icon name="lucide:x" class="ml-1 h-3 w-3" />
              </Badge>
            </div>
            <div class="flex gap-2">
              <Input
                v-model="newTag"
                placeholder="Añadir etiqueta y pulsar Enter..."
                @keyup.enter.prevent="addTag"
              />
              <Button type="button" variant="secondary" @click="addTag">
                <Icon name="lucide:plus" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Botones -->
      <div class="flex gap-4 pt-4">
        <Button
          type="submit"
          :disabled="isSubmitting || !form.title || !form.slug"
          class="flex-1"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:arrow-right" class="mr-2 h-4 w-4" />
          {{ isSubmitting ? 'Creando...' : 'Continuar al contenido' }}
        </Button>
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/socios">Cancelar</NuxtLink>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
  middleware: ['auth'],
  layout: 'dashboard',
})

// Formulario - Solo datos básicos
const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  category: '',
  tags: [] as string[],
})

const newTag = ref('')
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

// Generar slug automáticamente desde el título
watch(() => form.value.title, (newTitle, oldTitle) => {
  // Solo auto-generar si el slug está vacío o si coincidía con el título anterior
  if (!form.value.slug || form.value.slug === slugify(oldTitle || '')) {
    form.value.slug = slugify(newTitle)
  }
})

// Generar slug si está vacío (al perder foco del título)
const generateSlugIfEmpty = () => {
  if (!form.value.slug && form.value.title) {
    form.value.slug = slugify(form.value.title)
  }
}

// Función slugify mejorada
const slugify = (text: string): string => {
  if (!text) return ''
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 200)
}

// Añadir etiqueta
const addTag = () => {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTag.value = ''
}

// Eliminar etiqueta
const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

// Manejar archivo seleccionado
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) await uploadFile(file)
}

// Manejar drop
const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) await uploadFile(file)
}

// Subir archivo
const uploadFile = async (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Tipo no permitido', {
      description: 'Solo se permiten imágenes (JPG, PNG, WebP, GIF)'
    })
    return
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    toast.error('Archivo demasiado grande', {
      description: 'El máximo permitido es 10MB'
    })
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'blog')

  try {
    const response = await $fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
    form.value.coverImage = response.url
    toast.success('Imagen subida', {
      description: 'La imagen se ha subido correctamente'
    })
  } catch (error: any) {
    console.error('Error subiendo imagen:', error)
    toast.error('Error', {
      description: error.message || 'No se pudo subir la imagen'
    })
  }
}

// Crear post y redirigir al paso 2
const handleSubmit = async () => {
  if (!form.value.title || !form.value.slug) {
    toast.error('Error', { description: 'Título y slug son obligatorios' })
    return
  }

  isSubmitting.value = true
  
  try {
    const payload = {
      title: form.value.title,
      slug: form.value.slug,
      excerpt: form.value.excerpt || undefined,
      coverImage: form.value.coverImage || undefined,
      category: form.value.category || undefined,
      tags: form.value.tags.length > 0 ? form.value.tags : undefined,
      content: '<p></p>', // Contenido temporal vacío
      published: false, // Siempre borrador en el paso 1
    }

    const { data, error } = await useFetch('/api/posts', {
      method: 'POST',
      body: payload
    })

    if (error.value) {
      throw new Error(error.value.message || 'Error al crear el post')
    }

    toast.success('Post creado', {
      description: 'Ahora puedes añadir el contenido'
    })

    // Redirigir al paso 2 (editor de contenido)
    navigateTo(`/socios/posts/${data.value?.post?.id}/editar`)
    
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo crear el post'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
