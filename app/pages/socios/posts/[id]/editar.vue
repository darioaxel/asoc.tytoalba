<template>
  <div class="max-w-5xl mx-auto px-6 py-8 space-y-6">
    <!-- Header con pasos -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Editar Contenido</h1>
        <p class="text-muted-foreground mt-1">
          Paso 2 de 2: Escribe el contenido de "{{ post?.title || '...' }}"
        </p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/socios">
          <Icon name="lucide:x" class="mr-2 h-4 w-4" />
          Salir
        </NuxtLink>
      </Button>
    </div>

    <!-- Indicador de progreso -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 opacity-50">
        <div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium">
          <Icon name="lucide:check" class="h-4 w-4" />
        </div>
        <span>Datos básicos</span>
      </div>
      <div class="flex-1 h-px bg-border" />
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
          2
        </div>
        <span class="font-medium">Contenido</span>
      </div>
    </div>

    <!-- Vista previa del post -->
    <Card class="bg-muted/50">
      <CardContent class="p-4 flex items-center gap-4">
        <img 
          v-if="post?.cover" 
          :src="post.cover" 
          class="h-16 w-24 object-cover rounded-lg"
        />
        <div v-else class="h-16 w-24 bg-muted rounded-lg flex items-center justify-center">
          <Icon name="lucide:image" class="h-6 w-6 text-muted-foreground" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="font-semibold truncate">{{ post?.title }}</h2>
          <p class="text-sm text-muted-foreground truncate">{{ post?.excerpt || 'Sin resumen' }}</p>
          <div class="flex gap-2 mt-1">
            <Badge v-for="tag in post?.tags" :key="tag.id" variant="secondary" class="text-xs">
              {{ tag.name }}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" @click="goBackToStep1">
          <Icon name="lucide:pencil" class="h-4 w-4 mr-2" />
          Editar
        </Button>
      </CardContent>
    </Card>

    <!-- Editor de contenido -->
    <Card>
      <CardHeader>
        <CardTitle>Contenido del artículo</CardTitle>
        <CardDescription>
          Escribe el contenido completo. Puedes formatear texto, añadir imágenes y más.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Toolbar personalizado -->
        <div class="flex flex-wrap gap-2 pb-2 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="insertImage"
          >
            <Icon name="lucide:image-plus" class="h-4 w-4 mr-2" />
            Subir imagen
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="insertImageFromUrl"
          >
            <Icon name="lucide:link" class="h-4 w-4 mr-2" />
            Imagen desde URL
          </Button>
        </div>

        <!-- Novel Editor -->
        <div class="min-h-[500px]">
          <Editor
            v-model="content"
            class="min-h-[500px]"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Opciones de publicación -->
    <Card>
      <CardHeader>
        <CardTitle>Publicación</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <Label class="text-base">Publicar ahora</Label>
            <p class="text-sm text-muted-foreground">
              Si está desactivado, se guardará como borrador
            </p>
          </div>
          <Switch v-model="published" />
        </div>

        <Alert v-if="!published" variant="default" class="bg-muted">
          <Icon name="lucide:info" class="h-4 w-4" />
          <AlertDescription>
            Este post se guardará como borrador y no será visible públicamente.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>

    <!-- Botones -->
    <div class="flex gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        @click="goBackToStep1"
      >
        <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
        Volver
      </Button>
      <Button
        type="button"
        :disabled="isSaving || !content.trim()"
        variant="secondary"
        class="flex-1"
        @click="saveDraft"
      >
        <Icon v-if="isSaving" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
        <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
        {{ isSaving ? 'Guardando...' : 'Guardar borrador' }}
      </Button>
      <Button
        type="button"
        :disabled="isPublishing || !content.trim()"
        class="flex-1"
        @click="publish"
      >
        <Icon v-if="isPublishing" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
        <Icon v-else name="lucide:send" class="mr-2 h-4 w-4" />
        {{ isPublishing ? 'Publicando...' : (published ? 'Publicar post' : 'Guardar y salir') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icon } from '#components'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Editor } from '@codeverze/novel-vue'
import '@codeverze/novel-vue/dist/style.css'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

const route = useRoute()
const postId = route.params.id as string

// Estado
const post = ref<any>(null)
const content = ref('')
const published = ref(false)
const isSaving = ref(false)
const isPublishing = ref(false)
const isLoading = ref(true)

// Cargar el post
const fetchPost = async () => {
  try {
    const data = await $fetch(`/api/posts/${postId}`)
    post.value = data
    content.value = data.content || ''
    published.value = data.published || false
  } catch (error: any) {
    toast.error('Error', {
      description: 'No se pudo cargar el post'
    })
    navigateTo('/socios')
  } finally {
    isLoading.value = false
  }
}

// Subir imagen e insertarla
const insertImage = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp,image/gif'
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo no permitido')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Archivo demasiado grande (máx 10MB)')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'blog')

    try {
      toast.info('Subiendo imagen...')
      const response = await $fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      
      // Insertar imagen en el contenido (markdown)
      const imageMarkdown = `\n![${file.name}](${response.url})\n`
      content.value += imageMarkdown
      
      toast.success('Imagen insertada')
    } catch (error: any) {
      toast.error('Error', { description: error.message })
    }
  }
  
  input.click()
}

// Insertar imagen desde URL
const insertImageFromUrl = () => {
  const url = window.prompt('URL de la imagen:')
  if (url) {
    const alt = window.prompt('Texto alternativo (descripción):') || 'Imagen'
    const imageMarkdown = `\n![${alt}](${url})\n`
    content.value += imageMarkdown
  }
}

// Volver al paso 1 (editar datos básicos)
const goBackToStep1 = () => {
  // Guardar contenido actual como borrador antes de salir
  if (content.value.trim()) {
    saveContent(false)
  }
  // Aquí podríamos redirigir a una página de edición de datos básicos
  // Por ahora, mostramos un mensaje
  toast.info('Función en desarrollo', {
    description: 'La edición de datos básicos estará disponible próximamente'
  })
}

// Guardar contenido
const saveContent = async (showToast = true) => {
  try {
    const { error } = await $fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: {
        content: content.value,
        published: false,
      }
    })

    if (error) throw error

    if (showToast) {
      toast.success('Guardado', { description: 'El borrador se ha guardado' })
    }
    return true
  } catch (error: any) {
    toast.error('Error', { description: error.message || 'No se pudo guardar' })
    return false
  }
}

// Guardar borrador
const saveDraft = async () => {
  isSaving.value = true
  const success = await saveContent(true)
  isSaving.value = false
}

// Publicar
const publish = async () => {
  isPublishing.value = true
  
  try {
    const { error } = await $fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: {
        content: content.value,
        published: published.value,
      }
    })

    if (error) throw error

    toast.success(published.value ? '¡Publicado!' : 'Guardado', {
      description: published.value 
        ? 'Tu post ya está visible en el blog' 
        : 'El borrador se ha guardado correctamente'
    })

    // Redirigir al blog si se publicó, o al dashboard si es borrador
    if (published.value) {
      navigateTo(`/blog/${post.value.slug}`)
    } else {
      navigateTo('/blog')
    }
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo publicar'
    })
  } finally {
    isPublishing.value = false
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<style>
/* Novel Editor - Personalización en español */
.novel-editor {
  --novel-white: hsl(var(--background));
  --novel-black: hsl(var(--foreground));
}

.novel-editor .ProseMirror {
  padding: 1rem;
  min-height: 400px;
  outline: none;
}

/* Placeholder traducido */
.novel-editor .ProseMirror p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground));
  content: "Empieza a escribir o usa el botón '+' para añadir contenido...";
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
}
</style>
