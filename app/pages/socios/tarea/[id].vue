<template>
  <div class="max-w-4xl mx-auto px-6 py-8 space-y-6">
    <!-- Header con botón volver -->
    <div class="flex items-center gap-4">
      <Button variant="outline" size="sm" as-child>
        <NuxtLink to="/socios/tareas">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a listado de tareas
        </NuxtLink>
      </Button>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="h-12 w-12 text-destructive mx-auto mb-4" />
      <p class="text-muted-foreground">Error al cargar la tarea</p>
      <Button variant="outline" class="mt-4" @click="refresh()">
        Reintentar
      </Button>
    </div>

    <!-- Task details -->
    <div v-else-if="task" class="space-y-6">
      <!-- Cabecera de la tarea -->
      <Card>
        <CardHeader>
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Badge :class="taskTypeColors[task.type]">
                  {{ taskTypeLabels[task.type] }}
                </Badge>
                <Badge :class="taskStatusColors[task.status]">
                  {{ taskStatusLabels[task.status] }}
                </Badge>
              </div>
              <CardTitle class="text-2xl">{{ task.shortDesc }}</CardTitle>
              <CardDescription class="mt-2">
                Creada el {{ formatDateTime(task.createdAt) }}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent class="space-y-6">
          <!-- Descripción detallada -->
          <div v-if="task.longDesc" class="space-y-2">
            <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Descripción
            </h3>
            <div class="bg-muted/50 rounded-lg p-4 whitespace-pre-line">
              {{ task.longDesc }}
            </div>
          </div>

          <!-- Información de fechas -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-muted/30 rounded-lg p-4">
              <p class="text-sm text-muted-foreground mb-1">Fecha de inicio</p>
              <p class="font-medium">{{ formatDate(task.startDate) || 'No definida' }}</p>
            </div>
            <div class="bg-muted/30 rounded-lg p-4">
              <p class="text-sm text-muted-foreground mb-1">Fecha de fin estimada</p>
              <p class="font-medium">{{ formatDate(task.endDate) || 'No definida' }}</p>
            </div>
            <div v-if="task.resolvedAt" class="bg-muted/30 rounded-lg p-4">
              <p class="text-sm text-muted-foreground mb-1">Resuelta el</p>
              <p class="font-medium">{{ formatDateTime(task.resolvedAt) }}</p>
            </div>
          </div>

          <!-- Creador y validador -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Creada por
              </h3>
              <div class="flex items-center gap-3">
                <Avatar class="h-10 w-10">
                  <AvatarFallback>
                    {{ getInitials(task.creator) }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">{{ getFullName(task.creator) }}</p>
                  <p class="text-sm text-muted-foreground">{{ task.creator.email }}</p>
                </div>
              </div>
            </div>

            <div v-if="task.validator" class="space-y-2">
              <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Validador
              </h3>
              <div class="flex items-center gap-3">
                <Avatar class="h-10 w-10">
                  <AvatarFallback>
                    {{ getInitials(task.validator) }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">{{ getFullName(task.validator) }}</p>
                  <p class="text-sm text-muted-foreground">{{ task.validator.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Asignados -->
          <div class="space-y-2">
            <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Asignados ({{ task.assignees?.length || 0 }})
            </h3>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="assignee in task.assignees" 
                :key="assignee.user.id"
                class="flex items-center gap-2 bg-muted/50 rounded-full pl-1 pr-3 py-1"
              >
                <Avatar class="h-6 w-6">
                  <AvatarFallback class="text-xs">
                    {{ getInitials(assignee.user) }}
                  </AvatarFallback>
                </Avatar>
                <span class="text-sm">{{ getFullName(assignee.user) }}</span>
              </div>
            </div>
          </div>

          <!-- Documentos -->
          <div v-if="task.documents?.length > 0" class="space-y-2">
            <h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Documentos adjuntos
            </h3>
            <div class="space-y-2">
              <div 
                v-for="doc in task.documents" 
                :key="doc.id"
                class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <Icon name="lucide:file-text" class="h-5 w-5 text-muted-foreground" />
                  <span class="text-sm">{{ doc.originalName }}</span>
                </div>
                <Button variant="ghost" size="sm" as-child>
                  <a :href="doc.url" target="_blank" rel="noopener noreferrer">
                    <Icon name="lucide:download" class="h-4 w-4 mr-1" />
                    Descargar
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <!-- Acciones -->
        <CardFooter class="flex gap-3" v-if="canUpdateStatus">
          <Button 
            v-if="task.status === 'CREADA' || task.status === 'ASIGNADA'"
            @click="updateStatus('EN_CURSO')"
            :disabled="updating"
          >
            <Icon v-if="updating" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="lucide:play" class="mr-2 h-4 w-4" />
            Iniciar tarea
          </Button>
          
          <Button 
            v-if="task.status === 'EN_CURSO'"
            @click="updateStatus('ESPERANDO_VALIDACION')"
            :disabled="updating"
            variant="secondary"
          >
            <Icon v-if="updating" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="lucide:check-check" class="mr-2 h-4 w-4" />
            Marcar como completada
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const taskId = route.params.id as string

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

// Tipos
interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
}

interface Task {
  id: string
  shortDesc: string
  longDesc: string | null
  type: 'IMPORTANTE' | 'URGENTE' | 'PROPUESTA'
  status: 'CREADA' | 'ASIGNADA' | 'EN_CURSO' | 'RESUELTA' | 'ESPERANDO_VALIDACION'
  createdAt: string
  startDate: string | null
  endDate: string | null
  resolvedAt: string | null
  creator: User
  validator: User | null
  assignees: { user: User; assignedAt: string }[]
  documents: { id: string; originalName: string; url: string }[]
}

// Labels y colores
const taskStatusLabels: Record<string, string> = {
  CREADA: 'Creada',
  ASIGNADA: 'Asignada',
  EN_CURSO: 'En curso',
  RESUELTA: 'Resuelta',
  ESPERANDO_VALIDACION: 'Esperando validación'
}

const taskTypeLabels: Record<string, string> = {
  IMPORTANTE: 'Importante',
  URGENTE: 'Urgente',
  PROPUESTA: 'Propuesta'
}

const taskStatusColors: Record<string, string> = {
  CREADA: 'bg-slate-100 text-slate-800',
  ASIGNADA: 'bg-blue-100 text-blue-800',
  EN_CURSO: 'bg-yellow-100 text-yellow-800',
  RESUELTA: 'bg-green-100 text-green-800',
  ESPERANDO_VALIDACION: 'bg-purple-100 text-purple-800'
}

const taskTypeColors: Record<string, string> = {
  IMPORTANTE: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENTE: 'bg-red-100 text-red-800 border-red-200',
  PROPUESTA: 'bg-cyan-100 text-cyan-800 border-cyan-200'
}

// Estado
const updating = ref(false)

// Fetch de la tarea
const { data: task, pending, error, refresh } = await useFetch<Task>(`/api/tasks/${taskId}`)

// Verificar si el usuario puede actualizar el estado
const { user } = useUserSession()
const canUpdateStatus = computed(() => {
  if (!task.value) return false
  const isAssigned = task.value.assignees?.some(a => a.user.id === user.value?.id)
  const canUpdate = ['CREADA', 'ASIGNADA', 'EN_CURSO'].includes(task.value.status)
  return isAssigned && canUpdate
})

// Helpers
const getFullName = (user: User) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user.email
}

const getInitials = (user: User) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }
  return user.email.substring(0, 2).toUpperCase()
}

const formatDate = (date: string | null) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Actualizar estado
const updateStatus = async (newStatus: string) => {
  updating.value = true
  try {
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    
    toast.success('Estado actualizado', {
      description: `La tarea ha pasado a estado: ${taskStatusLabels[newStatus]}`
    })
    
    await refresh()
  } catch (error) {
    toast.error('Error', {
      description: 'No se pudo actualizar el estado de la tarea'
    })
  } finally {
    updating.value = false
  }
}
</script>
