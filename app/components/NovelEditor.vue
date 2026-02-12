<template>
  <div class="border rounded-lg overflow-hidden bg-background">
    <NovelEditor
      ref="editorRef"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :extensions="extensions"
      class="min-h-[400px]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NovelEditor } from '@codeverze/novel-vue'
import '@codeverze/novel-vue/dist/style.css'
import Image from '@tiptap/extension-image'
import { toast } from 'vue-sonner'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref()

// Extensión personalizada para manejar imágenes con upload
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    }
  },
})

// Extensiones adicionales
const extensions = computed(() => [
  CustomImage.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: 'rounded-lg max-w-full',
    },
  }),
])

// Función para subir imagen desde el editor
const uploadImage = async (file: File): Promise<string> => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo no permitido. Usa JPG, PNG, WebP o GIF.')
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('Archivo demasiado grande (máx 10MB).')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'blog')

  const response = await $fetch('/api/files/upload', {
    method: 'POST',
    body: formData
  })

  return response.url
}

// Exponer función para insertar imagen desde fuera
defineExpose({
  insertImage: async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp,image/gif'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        toast.info('Subiendo imagen...')
        const url = await uploadImage(file)
        
        // Insertar imagen en el editor
        const editor = editorRef.value?.editor
        if (editor) {
          editor.chain().focus().setImage({ src: url, alt: file.name }).run()
        }
        
        toast.success('Imagen insertada')
      } catch (error: any) {
        console.error('Error subiendo imagen:', error)
        toast.error('Error', { description: error.message })
      }
    }
    
    input.click()
  },
  
  // Función para insertar imagen desde URL
  insertImageFromUrl: () => {
    const url = window.prompt('URL de la imagen:')
    if (url) {
      const editor = editorRef.value?.editor
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
  }
})
</script>

<style>
/* Novel Editor Custom Styles */
.novel-editor {
  --novel-white: hsl(var(--background));
  --novel-black: hsl(var(--foreground));
  --novel-stone-50: hsl(var(--muted));
  --novel-stone-100: hsl(var(--muted));
  --novel-stone-200: hsl(var(--border));
  --novel-stone-300: hsl(var(--border));
  --novel-stone-400: hsl(var(--muted-foreground));
  --novel-stone-500: hsl(var(--muted-foreground));
  --novel-stone-600: hsl(var(--foreground));
  --novel-stone-700: hsl(var(--foreground));
  --novel-stone-800: hsl(var(--foreground));
  --novel-stone-900: hsl(var(--foreground));
  
  --novel-highlight-default: hsl(var(--muted));
  --novel-highlight-purple: rgba(168, 85, 247, 0.2);
  --novel-highlight-red: rgba(239, 68, 68, 0.2);
  --novel-highlight-yellow: rgba(234, 179, 8, 0.2);
  --novel-highlight-blue: rgba(59, 130, 246, 0.2);
  --novel-highlight-green: rgba(34, 197, 94, 0.2);
  --novel-highlight-orange: rgba(249, 115, 22, 0.2);
  --novel-highlight-pink: rgba(236, 72, 153, 0.2);
  --novel-highlight-gray: hsl(var(--muted));
}

.novel-editor .ProseMirror {
  padding: 1rem;
  min-height: 300px;
  outline: none;
}

.novel-editor .ProseMirror p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.novel-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.novel-editor .ProseMirror img.ProseMirror-selectednode {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
</style>
