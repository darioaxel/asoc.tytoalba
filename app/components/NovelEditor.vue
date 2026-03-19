<template>
  <div class="novel-editor-wrapper">
    <Editor
      ref="editorRef"
      :default-value="defaultValue"
      :on-update="handleUpdate"
      :on-debounced-update="handleDebouncedUpdate"
      :storage-key="storageKey"
      :class="editorClass"
      class="novel-editor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Editor } from '@codeverze/novel-vue'
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

const storageKey = computed(() => props.storageKey || 'novel__content')
const editorClass = computed(() => props.class || 'min-h-[400px]')

const defaultValue = computed<JSONContent>(() => {
  if (!props.modelValue) {
    return { type: 'doc', content: [{ type: 'paragraph' }] }
  }
  try {
    const parsed = JSON.parse(props.modelValue)
    if (parsed.type === 'doc') return parsed
  } catch {}
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: props.modelValue ? [{ type: 'text', text: props.modelValue }] : [] }]
  }
})

const handleUpdate = (editor: any) => emit('update:modelValue', editor.getHTML())
const handleDebouncedUpdate = (editor: any) => emit('update:modelValue', editor.getHTML())

defineExpose({
  insertImage: (url: string, alt: string = 'Imagen') => {
    const editor = editorRef.value?.getEditor()
    if (editor) {
      editor.chain().focus().setImage({ src: url, alt }).run()
      toast.success('Imagen insertada')
    } else {
      emit('update:modelValue', props.modelValue + `<img src="${url}" alt="${alt}" class="rounded-lg max-w-full my-4" />`)
    }
  },
  
  insertUploadedImage: async (file: File, postId?: string) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo no permitido. Usa JPG, PNG, WebP o GIF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Archivo demasiado grande (máx 10MB).')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'post-content')
    if (postId) formData.append('postId', postId)

    try {
      toast.info('Subiendo imagen...')
      const response = await $fetch('/api/files/upload', { method: 'POST', body: formData })
      const editor = editorRef.value?.getEditor()
      if (editor) {
        editor.chain().focus().setImage({ src: response.url, alt: file.name }).run()
      } else {
        emit('update:modelValue', props.modelValue + `<img src="${response.url}" alt="${file.name}" class="rounded-lg max-w-full my-4" />`)
      }
      toast.success('Imagen insertada')
      return response
    } catch (error: any) {
      toast.error('Error', { description: error.message })
      throw error
    }
  },
  
  getEditor: () => editorRef.value?.getEditor?.()
})
</script>

<style>
/* ============================================================================
   ESTILOS GLOBALES PARA NOVEL EDITOR
   ============================================================================ */

/* Contenedor */
.novel-editor-wrapper {
  background-color: hsl(var(--background));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
}

/* =============================================
   MODO CLARO - Estilos base
   ============================================= */

.novel-editor-wrapper .ProseMirror,
.novel-editor-wrapper .tiptap {
  background-color: hsl(var(--background)) !important;
  color: hsl(var(--foreground)) !important;
  padding: 1rem;
  min-height: 400px;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
}

.novel-editor-wrapper .ProseMirror *,
.novel-editor-wrapper .tiptap * {
  color: hsl(var(--foreground)) !important;
  caret-color: hsl(var(--foreground)) !important;
}

/* =============================================
   MODO OSCURO - Correcciones específicas
   El problema: Novel Vue inyecta estilos oscuros
   que sobreescriben las variables CSS
   ============================================= */

/* Forzar colores en modo oscuro usando el selector .dark */
.dark .novel-editor-wrapper,
html.dark .novel-editor-wrapper,
body.dark .novel-editor-wrapper {
  background-color: hsl(var(--background));
  border-color: hsl(var(--border));
}

.dark .novel-editor-wrapper .ProseMirror,
.dark .novel-editor-wrapper .tiptap,
html.dark .novel-editor-wrapper .ProseMirror,
html.dark .novel-editor-wrapper .tiptap {
  background-color: hsl(var(--background)) !important;
  color: hsl(var(--foreground)) !important;
}

/* Forzar color de texto CLARO en modo oscuro para TODOS los elementos */
.dark .novel-editor-wrapper .ProseMirror *,
.dark .novel-editor-wrapper .tiptap *,
html.dark .novel-editor-wrapper .ProseMirror *,
html.dark .novel-editor-wrapper .tiptap *,
.dark .novel-editor-wrapper .ProseMirror p,
.dark .novel-editor-wrapper .ProseMirror span,
.dark .novel-editor-wrapper .ProseMirror h1,
.dark .novel-editor-wrapper .ProseMirror h2,
.dark .novel-editor-wrapper .ProseMirror h3,
.dark .novel-editor-wrapper .ProseMirror h4,
.dark .novel-editor-wrapper .ProseMirror h5,
.dark .novel-editor-wrapper .ProseMirror h6,
.dark .novel-editor-wrapper .ProseMirror li,
.dark .novel-editor-wrapper .ProseMirror ul,
.dark .novel-editor-wrapper .ProseMirror ol,
.dark .novel-editor-wrapper .ProseMirror blockquote,
.dark .novel-editor-wrapper .ProseMirror strong,
.dark .novel-editor-wrapper .ProseMirror em,
.dark .novel-editor-wrapper .ProseMirror b,
.dark .novel-editor-wrapper .ProseMirror i,
.dark .novel-editor-wrapper .ProseMirror u,
.dark .novel-editor-wrapper .ProseMirror s,
.dark .novel-editor-wrapper .ProseMirror strike,
.dark .novel-editor-wrapper .ProseMirror code,
.dark .novel-editor-wrapper .ProseMirror pre,
.dark .novel-editor-wrapper .ProseMirror a,
.dark .novel-editor-wrapper .ProseMirror table,
.dark .novel-editor-wrapper .ProseMirror th,
.dark .novel-editor-wrapper .ProseMirror td,
.dark .novel-editor-wrapper .ProseMirror div,
.dark .novel-editor-wrapper .ProseMirror br {
  color: hsl(var(--foreground)) !important;
  caret-color: hsl(var(--foreground)) !important;
}

/* Corrección específica para el modo oscuro - forzar color claro */
@media (prefers-color-scheme: dark) {
  .novel-editor-wrapper .ProseMirror *,
  .novel-editor-wrapper .tiptap * {
    color: hsl(var(--foreground)) !important;
  }
}

/* =============================================
   PLACEHOLDER
   ============================================= */

.novel-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before,
.dark .novel-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground)) !important;
  content: "Empieza a escribir o usa '/' para comandos...";
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
}

/* =============================================
   TIPOGRAFÍA
   ============================================= */

.novel-editor-wrapper .ProseMirror p {
  margin-bottom: 0.75em;
}

.novel-editor-wrapper .ProseMirror h1,
.dark .novel-editor-wrapper .ProseMirror h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror h2,
.dark .novel-editor-wrapper .ProseMirror h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror h3,
.dark .novel-editor-wrapper .ProseMirror h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror h4,
.novel-editor-wrapper .ProseMirror h5,
.novel-editor-wrapper .ProseMirror h6,
.dark .novel-editor-wrapper .ProseMirror h4,
.dark .novel-editor-wrapper .ProseMirror h5,
.dark .novel-editor-wrapper .ProseMirror h6 {
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror ul,
.novel-editor-wrapper .ProseMirror ol {
  padding-left: 1.5rem;
  margin-bottom: 0.75em;
}

.novel-editor-wrapper .ProseMirror li,
.dark .novel-editor-wrapper .ProseMirror li {
  margin-bottom: 0.25em;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror li::marker,
.dark .novel-editor-wrapper .ProseMirror li::marker {
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror blockquote,
.dark .novel-editor-wrapper .ProseMirror blockquote {
  border-left: 3px solid hsl(var(--border));
  padding-left: 1rem;
  font-style: italic;
  margin-bottom: 0.75em;
  color: hsl(var(--foreground)) !important;
}

/* =============================================
   FORMATO INLINE
   ============================================= */

.novel-editor-wrapper .ProseMirror strong,
.novel-editor-wrapper .ProseMirror b,
.dark .novel-editor-wrapper .ProseMirror strong,
.dark .novel-editor-wrapper .ProseMirror b {
  font-weight: 700;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror em,
.novel-editor-wrapper .ProseMirror i,
.dark .novel-editor-wrapper .ProseMirror em,
.dark .novel-editor-wrapper .ProseMirror i {
  font-style: italic;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror u,
.dark .novel-editor-wrapper .ProseMirror u {
  text-decoration: underline;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror s,
.novel-editor-wrapper .ProseMirror strike,
.dark .novel-editor-wrapper .ProseMirror s,
.dark .novel-editor-wrapper .ProseMirror strike {
  text-decoration: line-through;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror a,
.dark .novel-editor-wrapper .ProseMirror a {
  color: hsl(var(--primary)) !important;
  text-decoration: underline;
}

/* =============================================
   CÓDIGO
   ============================================= */

.novel-editor-wrapper .ProseMirror code,
.dark .novel-editor-wrapper .ProseMirror code {
  background-color: hsl(var(--muted)) !important;
  color: hsl(var(--foreground)) !important;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.9em;
}

.novel-editor-wrapper .ProseMirror pre,
.dark .novel-editor-wrapper .ProseMirror pre {
  background-color: hsl(var(--muted)) !important;
  color: hsl(var(--foreground)) !important;
  padding: 1rem;
  border-radius: var(--radius);
  overflow-x: auto;
  margin-bottom: 0.75em;
}

.novel-editor-wrapper .ProseMirror pre code,
.dark .novel-editor-wrapper .ProseMirror pre code {
  background-color: transparent !important;
  padding: 0;
}

/* =============================================
   IMÁGENES
   ============================================= */

.novel-editor-wrapper .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  display: block;
}

.novel-editor-wrapper .ProseMirror img.ProseMirror-selectednode {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* =============================================
   TABLAS
   ============================================= */

.novel-editor-wrapper .ProseMirror table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 0.75em;
}

.novel-editor-wrapper .ProseMirror th,
.novel-editor-wrapper .ProseMirror td,
.dark .novel-editor-wrapper .ProseMirror th,
.dark .novel-editor-wrapper .ProseMirror td {
  border: 1px solid hsl(var(--border));
  padding: 0.5rem;
  text-align: left;
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror th,
.dark .novel-editor-wrapper .ProseMirror th {
  background-color: hsl(var(--muted)) !important;
  font-weight: 600;
}

/* =============================================
   MENÚS
   ============================================= */

.novel-editor-wrapper [data-bubble-menu="true"],
.novel-editor-wrapper [data-slash-menu="true"],
.dark .novel-editor-wrapper [data-bubble-menu="true"],
.dark .novel-editor-wrapper [data-slash-menu="true"] {
  background: hsl(var(--popover)) !important;
  border: 1px solid hsl(var(--border)) !important;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  z-index: 50;
}

.novel-editor-wrapper [data-slash-menu="true"] {
  max-height: 300px;
  overflow-y: auto;
}

.novel-editor-wrapper [data-bubble-menu="true"] *,
.novel-editor-wrapper [data-slash-menu="true"] *,
.dark .novel-editor-wrapper [data-bubble-menu="true"] *,
.dark .novel-editor-wrapper [data-slash-menu="true"] * {
  background: hsl(var(--popover)) !important;
  color: hsl(var(--popover-foreground)) !important;
}

/* =============================================
   ESTADOS
   ============================================= */

.novel-editor-wrapper .ProseMirror-selectednode {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

.novel-editor-wrapper .ProseMirror:focus {
  outline: none;
}

.novel-editor-wrapper .ProseMirror ::selection,
.dark .novel-editor-wrapper .ProseMirror ::selection {
  background-color: hsl(var(--primary) / 0.3);
  color: hsl(var(--foreground)) !important;
}

.novel-editor-wrapper .ProseMirror {
  caret-color: hsl(var(--foreground)) !important;
}

/* Corrección para estilos inline */
.novel-editor-wrapper .ProseMirror [style*="color"]:not([style*="background-color"]),
.dark .novel-editor-wrapper .ProseMirror [style*="color"]:not([style*="background-color"]) {
  color: hsl(var(--foreground)) !important;
}
</style>
