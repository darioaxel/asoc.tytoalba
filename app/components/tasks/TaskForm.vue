<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Tipo -->
      <div>
        <Label>Tipo de tarea *</Label>
        <Select v-model="form.type" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IMPORTANTE">Importante</SelectItem>
            <SelectItem value="URGENTE">Urgente</SelectItem>
            <SelectItem value="PROPUESTA">Propuesta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Estado -->
      <div>
        <Label>Estado</Label>
        <Select v-model="form.status">
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CREADA">Creada</SelectItem>
            <SelectItem value="ASIGNADA">Asignada</SelectItem>
            <SelectItem value="EN_CURSO">En curso</SelectItem>
            <SelectItem value="ESPERANDO_VALIDACION">Esperando validación</SelectItem>
            <SelectItem value="RESUELTA">Resuelta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Descripción breve -->
    <div>
      <Label>Descripción breve *</Label>
      <Input v-model="form.shortDesc" maxlength="255" required placeholder="Resumen de la tarea..." />
    </div>

    <!-- Descripción ampliada -->
    <div>
      <Label>Descripción detallada</Label>
      <Textarea v-model="form.longDesc" rows="4" placeholder="Detalles adicionales..." />
    </div>

    <!-- Asignados -->
    <div>
      <Label>Socios asignados *</Label>
      <MultiSelect
        v-model="form.assigneeIds"
        :options="users"
        option-label="email"
        option-value="id"
        placeholder="Seleccionar socios..."
        display="chip"
        filter
        :loading="loadingUsers"
      >
        <template #option="slotProps">
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ slotProps.option.firstName?.[0] || slotProps.option.email[0] }}
              </AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium">
                {{ slotProps.option.firstName }} {{ slotProps.option.lastName }}
              </p>
              <p class="text-xs text-muted-foreground">{{ slotProps.option.email }}</p>
            </div>
          </div>
        </template>
      </MultiSelect>
    </div>

    <!-- Validador -->
    <div>
      <Label>Validador (Admin)</Label>
      <Select v-model="form.validatorId">
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar validador..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Sin validador</SelectItem>
          <SelectItem v-for="admin in admins" :key="admin.id" :value="admin.id">
            {{ admin.firstName }} {{ admin.lastName }} ({{ admin.email }})
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Fechas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label>Fecha de inicio</Label>
        <Input v-model="form.startDate" type="date" />
      </div>
      <div>
        <Label>Fecha de fin estimada</Label>
        <Input v-model="form.endDate" type="date" />
      </div>
      <div v-if="form.status === 'RESUELTA'">
        <Label>Fecha de resolución</Label>
        <Input v-model="form.resolvedAt" type="datetime-local" />
      </div>
    </div>

    <!-- Documentos (solo en edición) -->
    <div v-if="isEditing" class="border rounded-lg p-4">
      <Label class="mb-2 block">Documentos adjuntos</Label>
      <div class="space-y-2">
        <div v-for="doc in existingDocuments" :key="doc.id" class="flex items-center justify-between p-2 bg-muted rounded">
          <div class="flex items-center gap-2">
            <Icon name="lucide:file-text" class="h-4 w-4" />
            <span class="text-sm">{{ doc.originalName }}</span>
          </div>
          <div class="flex gap-2">
            <Button type="button" variant="ghost" size="sm" @click="downloadDocument(doc)">
              <Icon name="lucide:download" class="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" class="text-destructive" @click="removeDocument(doc.id)">
              <Icon name="lucide:trash" class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div class="mt-4">
        <Label>Añadir nuevos documentos</Label>
        <Input 
          type="file" 
          multiple 
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" 
          @change="handleFileUpload"
        />
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancelar
      </Button>
      <Button type="submit" :disabled="isSubmitting">
        <Icon v-if="isSubmitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEditing ? 'Guardar cambios' : 'Crear tarea' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TaskType, TaskStatus } from '@prisma/client'

const props = defineProps<{
  initialData?: any
  isEditing?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  shortDesc: '',
  longDesc: '',
  type: 'PROPUESTA' as TaskType,
  status: 'CREADA' as TaskStatus,
  assigneeIds: [] as string[],
  validatorId: '',
  startDate: '',
  endDate: '',
  resolvedAt: ''
})

const users = ref([])
const admins = ref([])
const loadingUsers = ref(false)
const isSubmitting = ref(false)
const existingDocuments = ref([])
const newFiles = ref<File[]>([])

// Cargar usuarios y admins
const fetchUsers = async () => {
  loadingUsers.value = true
  const [usersRes, adminsRes] = await Promise.all([
    $fetch('/api/users'), // Lista de socios activos
    $fetch('/api/users/admins')
  ])
  users.value = usersRes
  admins.value = adminsRes
  loadingUsers.value = false
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Subir archivos primero si hay nuevos
    const uploadedDocs = []
    for (const file of newFiles.value) {
      const formData = new FormData()
      formData.append('file', file)
      const uploaded = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      uploadedDocs.push(uploaded)
    }

    const payload = {
      ...form.value,
      documents: uploadedDocs
    }
    
    emit('submit', payload)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    newFiles.value = Array.from(target.files)
  }
}

const removeDocument = async (docId: string) => {
  await $fetch(`/api/tasks/documents/${docId}`, { method: 'DELETE' })
  existingDocuments.value = existingDocuments.value.filter((d: any) => d.id !== docId)
}

const downloadDocument = (doc: any) => {
  window.open(doc.url, '_blank')
}

onMounted(() => {
  fetchUsers()
  if (props.initialData) {
    form.value = {
      ...props.initialData,
      startDate: props.initialData.startDate?.split('T')[0] || '',
      endDate: props.initialData.endDate?.split('T')[0] || '',
      assigneeIds: props.initialData.assignees?.map((a: any) => a.userId) || [],
      validatorId: props.initialData.validatorId || ''
    }
    existingDocuments.value = props.initialData.documents || []
  }
})
</script>