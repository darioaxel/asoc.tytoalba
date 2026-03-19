<template>
  <div class="novel-editor-container border rounded-lg overflow-hidden bg-background dark:bg-background h-full">
    <Editor
      ref="editorRef"
      :default-value="defaultValue"
      :on-update="handleUpdate"
      :on-debounced-update="handleDebouncedUpdate"
      :storage-key="storageKey"
      :class="editorClass"
      class="dark-mode-compatible h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Editor } from '@codeverze/novel-vue'
import '@codeverze/novel-vue/dist/style.css'
import { toast } from 'vue-sonner'
import type { JSONContent } from '@tiptap/core'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  storageKey?: string
  class?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref()

// Generar storage key única para cada post
const storageKey = computed(() => props.storageKey || 'novel__content')

// Clases del editor - usar la clase pasada o default
const editorClass = computed(() => props.class || 'min-h-[400px]')

// Convertir HTML/markdown a JSONContent para Novel
const defaultValue = computed<JSONContent>(() => {
  if (!props.modelValue) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }]
    }
  }
  
  // Si es HTML, Novel lo maneja internamente
  // Si es markdown con imágenes ![alt](url), necesitamos convertirlo
  return htmlToJSON(props.modelValue)
})

// Convertir HTML a TipTap JSON
function htmlToJSON(html: string): JSONContent {
  // Si ya es JSON, parsearlo
  try {
    const parsed = JSON.parse(html)
    if (parsed.type === 'doc') return parsed
  } catch {
    // No es JSON, continuar con conversión
  }
  
  // Novel maneja HTML automáticamente si usamos el editor correctamente
  // Pero para inicializar, devolvemos un doc vacío y dejamos que el editor cargue
  return {
    type: 'doc',
    content: [{
      type: 'paragraph',
      content: html ? [{ type: 'text', text: html }] : []
    }]
  }
}

// Manejar actualización del editor
const handleUpdate = (editor: any) => {
  const html = editor.getHTML()
  emit('update:modelValue', html)
}

// Manejar actualización debounced (para guardado automático)
const handleDebouncedUpdate = (editor: any) => {
  const html = editor.getHTML()
  emit('update:modelValue', html)
}

// Exponer métodos para insertar imágenes
defineExpose({
  // Insertar imagen desde URL
  insertImage: (url: string, alt: string = 'Imagen') => {
    const editor = editorRef.value?.getEditor()
    if (editor) {
      editor.chain().focus().setImage({ src: url, alt }).run()
      toast.success('Imagen insertada')
    } else {
      // Fallback: añadir al contenido como HTML
      const imgHtml = `<img src="${url}" alt="${alt}" class="rounded-lg max-w-full my-4" />`
      emit('update:modelValue', props.modelValue + imgHtml)
    }
  },
  
  // Insertar imagen subida
  insertUploadedImage: async (file: File, postId?: string) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo no permitido. Usa JPG, PNG, WebP o GIF.')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('Archivo demasiado grande (máx 10MB).')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'post-content')
    if (postId) formData.append('postId', postId)

    try {
      toast.info('Subiendo imagen...')
      const response = await $fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      
      // Insertar imagen en el editor
      const editor = editorRef.value?.getEditor()
      if (editor) {
        editor.chain().focus().setImage({ 
          src: response.url, 
          alt: file.name 
        }).run()
      } else {
        // Fallback
        const imgHtml = `<img src="${response.url}" alt="${file.name}" class="rounded-lg max-w-full my-4" />`
        emit('update:modelValue', props.modelValue + imgHtml)
      }
      
      toast.success('Imagen insertada')
      return response
    } catch (error: any) {
      toast.error('Error', { description: error.message })
      throw error
    }
  },
  
  // Obtener el editor interno
  getEditor: () => editorRef.value?.getEditor?.()
})
</script>

<style scoped>
/* Novel Editor - Estilos encapsulados (scoped) para no afectar a la web */
/* IMPORTANTE: Los estilos de Novel Vue se importan globalmente en el script */
/* Aquí sobrescribimos solo lo necesario para mantener la consistencia */

/* Novel Editor Custom Styles - Modo claro y oscuro */
.novel-editor-container :deep(.ProseMirror),
.novel-editor-container .ProseMirror {
  padding: 1rem;
  min-height: 400px;
  outline: none;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Forzar colores en modo oscuro */
:deep(.dark) .novel-editor-container :deep(.ProseMirror),
.dark .novel-editor-container .ProseMirror {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Placeholder traducido */
.novel-editor-container :deep(.ProseMirror p.is-editor-empty:first-child::before),
.novel-editor-container .ProseMirror p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground));
  content: "Empieza a escribir o usa el menú '/' para comandos...";
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
}

/* Estilos para imágenes */
.novel-editor-container :deep(.ProseMirror img),
.novel-editor-container .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  display: block;
}

.novel-editor-container :deep(.ProseMirror img.ProseMirror-selectednode),
.novel-editor-container .ProseMirror img.ProseMirror-selectednode {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Estilos para el menú de burbuja */
.novel-editor-container :deep([data-bubble-menu="true"]),
.novel-editor-container [data-bubble-menu="true"] {
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Estilos para el menú slash */
.novel-editor-container :deep([data-slash-menu="true"]),
.novel-editor-container [data-slash-menu="true"] {
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Asegurar que los textos del editor sean visibles */
.novel-editor-container :deep(.ProseMirror p),
.novel-editor-container :deep(.ProseMirror h1),
.novel-editor-container :deep(.ProseMirror h2),
.novel-editor-container :deep(.ProseMirror h3),
.novel-editor-container :deep(.ProseMirror h4),
.novel-editor-container :deep(.ProseMirror h5),
.novel-editor-container :deep(.ProseMirror h6),
.novel-editor-container :deep(.ProseMirror li),
.novel-editor-container :deep(.ProseMirror blockquote),
.novel-editor-container .ProseMirror p,
.novel-editor-container .ProseMirror h1,
.novel-editor-container .ProseMirror h2,
.novel-editor-container .ProseMirror h3,
.novel-editor-container .ProseMirror h4,
.novel-editor-container .ProseMirror h5,
.novel-editor-container .ProseMirror h6,
.novel-editor-container .ProseMirror li,
.novel-editor-container .ProseMirror blockquote {
  color: hsl(var(--foreground));
}

/* Fix para elementos del editor en modo oscuro */
:deep(.dark) .novel-editor-container :deep([data-bubble-menu="true"]),
:deep(.dark) .novel-editor-container :deep([data-slash-menu="true"]),
.dark .novel-editor-container [data-bubble-menu="true"],
.dark .novel-editor-container [data-slash-menu="true"] {
  background: hsl(var(--popover));
  border-color: hsl(var(--border));
  color: hsl(var(--popover-foreground));
}
</style>
