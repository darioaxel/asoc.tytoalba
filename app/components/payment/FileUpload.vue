<template>
  <Card :class="{ 'border-primary ring-1 ring-primary': isOverDropZone }">
    <CardHeader>
      <CardTitle>Justificante de pago</CardTitle>
      <CardDescription>
        Arrastra aquí tu archivo o selecciónalo
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Área de drop -->
      <div
        v-if="!file"
        ref="dropZoneRef"
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
          isOverDropZone 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        ]"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*,.pdf"
          class="hidden"
          @change="onFileSelect"
        />

        <div v-if="loading" class="py-4">
          <Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />
          <p class="mt-2 text-sm text-muted-foreground">Subiendo...</p>
        </div>

        <template v-else>
          <UploadCloud 
            :class="[
              'mx-auto h-12 w-12 mb-4 transition-colors',
              isOverDropZone ? 'text-primary' : 'text-muted-foreground'
            ]" 
          />
          
          <p class="text-sm mb-2">
            <span class="text-muted-foreground">Arrastra aquí o</span>
            <button 
              type="button"
              class="text-primary hover:underline font-medium ml-1"
              @click="fileInput?.click()"
            >
              selecciona un archivo
            </button>
          </p>
          
          <p class="text-xs text-muted-foreground">
            PDF, JPG, PNG o WebP • Máx. 5MB
          </p>

          <!-- Botón cámara móvil -->
          <template v-if="isMobile">
            <div class="mt-4 pt-4 border-t">
              <p class="text-xs text-muted-foreground mb-2">O desde tu móvil:</p>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                @click="cameraInput?.click()"
              >
                <Camera class="h-4 w-4 mr-2" />
                Tomar foto
              </Button>
            </div>
            <input
              ref="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="onFileSelect"
            />
          </template>
        </template>
      </div>

      <!-- Archivo subido -->
      <div 
        v-else 
        class="flex items-center gap-4 p-4 bg-muted rounded-lg animate-in fade-in"
      >
        <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
          <FileCheck class="h-6 w-6 text-green-600" />
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="font-medium truncate">{{ file.name }}</p>
          <p class="text-sm text-muted-foreground">
            {{ formatSize(file.size) }} • {{ file.type }}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          @click="clear"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>

      <!-- Error -->
      <Alert v-if="error" variant="destructive" class="mt-4">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { UploadCloud, FileCheck, X, Camera, Loader2, AlertCircle } from 'lucide-vue-next'
import { useFileUpload } from '~/composables/useFileUpload'

const props = defineProps<{
  modelValue: UploadedFile | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: UploadedFile | null]
}>()

const { 
  file, 
  loading, 
  error, 
  isOverDropZone, 
  dropZoneRef, 
  handleFile, 
  clear 
} = useFileUpload()

const fileInput = ref<HTMLInputElement>()
const cameraInput = ref<HTMLInputElement>()

const isMobile = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

// Sincronizar con v-model
watch(file, (val) => {
  emit('update:modelValue', val)
})

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) handleFile(f)
  // Limpiar input para permitir reselección
  input.value = ''
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>