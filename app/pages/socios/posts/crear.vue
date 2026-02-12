<template>
  <div class="max-w-4xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Crear Post</h1>
        <p class="text-muted-foreground mt-1">
          Escribe y publica un nuevo artículo para el blog
        </p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/blog">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver al blog
        </NuxtLink>
      </Button>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información básica -->
      <Card>
        <CardHeader>
          <CardTitle>Información del post</CardTitle>
          <CardDescription>
            Completa los datos básicos del artículo
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
          </div>

          <!-- Imagen destacada -->
          <div class="space-y-2">
            <Label for="coverImage">Imagen de portada</Label>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="hidden"
              @change="handleImageUpload"
            />
            <div class="flex gap-2">
              <Input
                id="coverImage"
                v-model="form.coverImage"
                placeholder="URL de la imagen o sube una nueva"
              />
              <Button
                type="button"
                variant="secondary"
                @click="openImageUpload"
              >
                <Icon name="lucide:upload" class="h-4 w-4 mr-2" />
                Subir
              </Button>
            </div>
            <div v-if="form.coverImage" class="mt-2">
              <img 
                :src="form.coverImage" 
                alt="Preview" 
                class="max-h-32 rounded-lg border object-cover"
              />
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
                class="cursor-pointer"
                @click="removeTag(tag)"
              >
                {{ tag }}
                <Icon name="lucide:x" class="ml-1 h-3 w-3" />
              </Badge>
            </div>
            <div class="flex gap-2">
              <Input
                v-model="newTag"
                placeholder="Añadir etiqueta..."
                @keyup.enter.prevent="addTag"
              />
              <Button type="button" variant="secondary" @click="addTag">
                <Icon name="lucide:plus" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Contenido del post -->
      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
          <CardDescription>
            Escribe el contenido completo de tu artículo usando el editor
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Toolbar del editor -->
          <div class="flex flex-wrap gap-2 pb-2 border-b">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="editorRef?.insertImage()"
            >
              <Icon name="lucide:image-plus" class="h-4 w-4 mr-2" />
              Subir imagen
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="editorRef?.insertImageFromUrl()"
            >
              <Icon name="lucide:link" class="h-4 w-4 mr-2" />
              Imagen desde URL
            </Button>
          </div>
          <NovelEditor
            ref="editorRef"
            v-model="form.content"
            placeholder="Comienza a escribir tu artículo aquí..."
          />
        </CardContent>
      </Card>

      <!-- Opciones de publicación -->
      <Card>
        <CardHeader>
          <CardTitle>Opciones de publicación</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <Label class="text-base">Publicar inmediatamente</Label>
              <p class="text-sm text-muted-foreground">
                Si está desactivado, se guardará como borrador
              </p>
            </div>
            <Switch v-model="form.published" />
          </div>

          <div v-if="!form.published" class="p-4 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground">
              <Icon name="lucide:info" class="h-4 w-4 inline mr-1" />
              Este post se guardará como borrador y no será visible públicamente.
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Botones -->
      <div class="flex gap-4 pt-4">
        <Button
          type="submit"
          :disabled="isSubmitting || !form.title || !form.slug || !form.content"
          class="flex-1"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:send" class="mr-2 h-4 w-4" />
          {{ isSubmitting ? 'Publicando...' : form.published ? 'Publicar post' : 'Guardar borrador' }}
        </Button>
        <Button type="button" variant="outline" @click="saveDraft" :disabled="isSaving">
          <Icon v-if="isSaving" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
          Guardar
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
import { Switch } from '@/components/ui/switch'
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

// Formulario
const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  category: '',
  tags: [] as string[],
  content: '',
  published: true,
})

const newTag = ref('')
const isSubmitting = ref(false)
const isSaving = ref(false)
const editorRef = ref()

// Generar slug automáticamente desde el título
watch(() => form.value.title, (title) => {
  if (!form.value.slug || form.value.slug === generateSlug(form.value.title.slice(0, -1))) {
    form.value.slug = generateSlug(title)
  }
})

// Generar slug
const generateSlug = (text: string): string => {
  return text
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

// Subir imagen
const fileInput = ref<HTMLInputElement>()

const openImageUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

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

  // Limpiar input
  target.value = ''
}

// Guardar borrador
const saveDraft = async () => {
  if (!form.value.title) {
    toast.error('Error', { description: 'El título es obligatorio' })
    return
  }

  isSaving.value = true
  
  try {
    const payload = {
      ...form.value,
      published: false,
    }

    const { data, error } = await useFetch('/api/posts', {
      method: 'POST',
      body: payload
    })

    if (error.value) {
      throw new Error(error.value.message || 'Error al guardar')
    }

    toast.success('Borrador guardado', {
      description: 'El post se ha guardado como borrador'
    })
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo guardar el borrador'
    })
  } finally {
    isSaving.value = false
  }
}

// Enviar formulario
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
      content: form.value.content,
      published: form.value.published,
    }

    const { data, error } = await useFetch('/api/posts', {
      method: 'POST',
      body: payload
    })

    if (error.value) {
      throw new Error(error.value.message || 'Error al crear el post')
    }

    toast.success(form.value.published ? 'Post publicado' : 'Borrador guardado', {
      description: form.value.published 
        ? 'El artículo ha sido publicado exitosamente' 
        : 'El borrador se ha guardado correctamente'
    })

    navigateTo(form.value.published ? `/blog/${form.value.slug}` : '/socios')
    
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo crear el post'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
