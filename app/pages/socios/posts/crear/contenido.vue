<template>
  <div class="max-w-5xl mx-auto px-6 py-8 space-y-6">
    <!-- Header con pasos -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Crear Post</h1>
        <p class="text-muted-foreground mt-1">
          Paso 2 de 2: Contenido de "{{ post?.title || '...' }}"
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
    <Card class="bg-muted/50" v-if="post">
      <CardContent class="p-4 flex items-center gap-4">
        <img 
          v-if="post.cover" 
          :src="post.cover" 
          class="h-16 w-24 object-cover rounded-lg"
        />
        <div v-else class="h-16 w-24 bg-muted rounded-lg flex items-center justify-center">
          <Icon name="lucide:image" class="h-6 w-6 text-muted-foreground" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="font-semibold truncate">{{ post.title }}</h2>
          <p class="text-sm text-muted-foreground truncate">{{ post.excerpt || 'Sin resumen' }}</p>
          <div class="flex gap-2 mt-1">
            <Badge v-for="tag in post.tags" :key="tag.id" variant="secondary" class="text-xs">
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

    <!-- Cargando -->
    <Card v-else>
      <CardContent class="p-8 text-center">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p class="text-muted-foreground mt-2">Cargando post...</p>
      </CardContent>
    </Card>

    <!-- Editor de contenido -->
    <Card v-if="post">
      <CardHeader>
        <CardTitle>Contenido del artículo</CardTitle>
        <CardDescription>
          Escribe el contenido completo. Puedes formatear texto, añadir imágenes y más.
          <br>
          <span class="text-xs text-muted-foreground">
            Usa "/" para ver comandos, selecciona texto para formato rápido.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Toolbar personalizado -->
        <div class="flex flex-wrap gap-2 pb-2 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="uploadAndInsertImage"
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="insertImageFromGallery"
          >
            <Icon name="lucide:images" class="h-4 w-4 mr-2" />
            Galería del post
          </Button>
        </div>

        <!-- Novel Editor - Con scoped styles -->
        <div class="novel-editor-wrapper">
          <NovelEditor
            ref="editorRef"
            v-model="content"
            :storage-key="`novel-post-${postId}`"
            placeholder="Empieza a escribir tu artículo..."
            class="min-h-[500px] max-h-[600px] overflow-y-auto"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Opciones de publicación -->
    <Card v-if="post">
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
          <Switch 
            v-model="published" 
            class="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
          />
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
    <div class="flex gap-4 pt-4" v-if="post">
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
        :disabled="isSaving"
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
        :disabled="isPublishing"
        class="flex-1 bg-primary hover:bg-primary/90"
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

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

const route = useRoute()
const postId = route.query.id as string

// Verificar que tenemos un ID válido
if (!postId) {
  toast.error('Error', { description: 'No se especificó el post a editar' })
  navigateTo('/socios/posts/crear')
}

// Estado
const post = ref<any>(null)
const content = ref('')
const published = ref(false)
const isSaving = ref(false)
const isPublishing = ref(false)
const editorRef = ref()

// Cargar el post
const fetchPost = async () => {
  try {
    const data = await $fetch(`/api/posts/manage/${postId}`)
    post.value = data
    content.value = data.content || ''
    published.value = data.published || false
  } catch (error: any) {
    toast.error('Error', {
      description: 'No se pudo cargar el post'
    })
    navigateTo('/socios')
  }
}

// Subir imagen e insertarla en el editor
const uploadAndInsertImage = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp,image/gif'
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    try {
      await editorRef.value?.insertUploadedImage?.(file, postId)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  input.click()
}

// Insertar imagen desde URL
const insertImageFromUrl = () => {
  const url = window.prompt('URL de la imagen:')
  if (!url) return
  
  const alt = window.prompt('Texto alternativo (descripción):') || 'Imagen'
  
  try {
    editorRef.value?.insertImage?.(url, alt)
  } catch (error) {
    toast.error('Error al insertar imagen')
  }
}

// Mostrar galería de imágenes del post
const insertImageFromGallery = async () => {
  try {
    // Obtener imágenes relacionadas con el post
    const images = await $fetch(`/api/posts/manage/${postId}/images`)
    
    if (!images || images.length === 0) {
      toast.info('No hay imágenes', {
        description: 'Este post no tiene imágenes en la galería'
      })
      return
    }
    
    // Mostrar selector simple (podría ser un modal más elaborado)
    const urls = images.map((img: any) => img.file?.path).filter(Boolean)
    const selected = window.prompt(
      `Imágenes disponibles:\n${urls.map((u: string, i: number) => `${i + 1}. ${u}`).join('\n')}\n\nIntroduce el número de la imagen:`
    )
    
    const index = parseInt(selected || '0') - 1
    if (index >= 0 && index < urls.length) {
      editorRef.value?.insertImage?.(urls[index], 'Imagen del post')
    }
  } catch (error) {
    toast.error('Error al cargar galería')
  }
}

// Volver al paso 1 (editar datos básicos)
const goBackToStep1 = () => {
  // Guardar contenido actual antes de salir
  saveContent(false).then(() => {
    // Navegar de vuelta al paso 1 con el ID para recuperar los datos
    navigateTo('/socios/posts/crear')
  })
}

// Guardar contenido
const saveContent = async (showToast = true): Promise<boolean> => {
  try {
    const { error } = await $fetch(`/api/posts/manage/${postId}`, {
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
  await saveContent(true)
  isSaving.value = false
}

// Publicar
const publish = async () => {
  isPublishing.value = true
  
  try {
    const { error } = await $fetch(`/api/posts/manage/${postId}`, {
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

<style scoped>
/* Wrapper para el editor que aísla los estilos */
.novel-editor-wrapper {
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  overflow: hidden;
}
</style>
