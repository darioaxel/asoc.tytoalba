<template>
  <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Mis Tareas</h1>
        <p class="text-muted-foreground mt-1">
          Tareas asignadas pendientes y en curso
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <NuxtLink to="/socios">
            <Icon name="lucide:home" class="mr-2 h-4 w-4" />
            Dashboard
          </NuxtLink>
        </Button>
        <Button as-child>
          <NuxtLink to="/socios/tareas/nueva">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Nueva tarea
          </NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 items-end">
      <div class="w-full sm:w-auto">
        <Label>Estado</Label>
        <Select v-model="filters.status">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem v-for="(label, key) in taskStatusLabels" :key="key" :value="key">
              {{ label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div class="w-full sm:w-auto">
        <Label>Importancia</Label>
        <Select v-model="filters.type">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem v-for="(label, key) in taskTypeLabels" :key="key" :value="key">
              {{ label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div class="w-full sm:w-auto flex-1 sm:max-w-sm">
        <Label>Búsqueda</Label>
        <Input 
          v-model="filters.search" 
          placeholder="Buscar en descripción..." 
          @keyup.enter="refresh"
        />
      </div>
      
      <Button @click="refresh" variant="outline" size="icon">
        <Icon name="lucide:refresh-cw" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Tabla de tareas -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead class="w-[100px]">Tipo</TableHead>
            <TableHead class="w-[120px]">Estado</TableHead>
            <TableHead class="w-[100px]">Creada</TableHead>
            <TableHead class="w-[100px]">Inicio</TableHead>
            <TableHead class="w-[80px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow 
            v-for="task in tasks" 
            :key="task.id"
            class="cursor-pointer hover:bg-muted/50"
            @click="navigateTo(`/socios/tarea/${task.id}`)"
          >
            <TableCell class="font-medium max-w-[300px] truncate">
              {{ task.shortDesc }}
            </TableCell>
            <TableCell>
              <Badge :class="taskTypeColors[task.type]">
                {{ taskTypeLabels[task.type] }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge :class="taskStatusColors[task.status]">
                {{ taskStatusLabels[task.status] }}
              </Badge>
            </TableCell>
            <TableCell>{{ formatDate(task.createdAt) }}</TableCell>
            <TableCell>{{ formatDate(task.startDate) || '-' }}</TableCell>
            <TableCell @click.stop>
              <Button variant="ghost" size="icon" as-child>
                <NuxtLink :to="`/socios/tarea/${task.id}`">
                  <Icon name="lucide:eye" class="h-4 w-4" />
                </NuxtLink>
              </Button>
            </TableCell>
          </TableRow>
          
          <TableRow v-if="tasks.length === 0">
            <TableCell colspan="6" class="h-24 text-center text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:clipboard-check" class="h-8 w-8 opacity-50" />
                <p>No tienes tareas asignadas</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between" v-if="pagination.total > 0">
      <p class="text-sm text-muted-foreground">
        Mostrando {{ tasks.length }} de {{ pagination.total }} tareas
      </p>
      <div class="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="pagination.page <= 1"
          @click="changePage(pagination.page - 1)"
        >
          <Icon name="lucide:chevron-left" class="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <span class="text-sm text-muted-foreground px-2">
          Página {{ pagination.page }} de {{ pagination.totalPages }}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="!pagination.hasMore"
          @click="changePage(pagination.page + 1)"
        >
          Siguiente
          <Icon name="lucide:chevron-right" class="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Icon } from '#components'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Tipos
interface Task {
  id: string
  shortDesc: string
  type: 'IMPORTANTE' | 'URGENTE' | 'PROPUESTA'
  status: 'CREADA' | 'ASIGNADA' | 'EN_CURSO' | 'RESUELTA' | 'ESPERANDO_VALIDACION'
  createdAt: string
  startDate: string | null
  endDate: string | null
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
const tasks = ref<Task[]>([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: false
})

const filters = ref({
  status: 'ALL',
  type: 'ALL',
  search: ''
})

// Cargar tareas
const fetchTasks = async () => {
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.value.page.toString())
    params.append('limit', pagination.value.limit.toString())
    params.append('mine', 'true') // Solo mis tareas asignadas
    
    if (filters.value.status && filters.value.status !== 'ALL') params.append('status', filters.value.status)
    if (filters.value.type && filters.value.type !== 'ALL') params.append('type', filters.value.type)
    if (filters.value.search) params.append('search', filters.value.search)
    
    const data = await $fetch<{ tasks: Task[], pagination: any }>(`/api/tasks?${params}`)
    
    if (data) {
      tasks.value = data.tasks
      pagination.value = data.pagination
    }
  } catch (error) {
    console.error('Error cargando tareas:', error)
    tasks.value = []
  }
}

const refresh = () => {
  pagination.value.page = 1
  fetchTasks()
}

const changePage = (page: number) => {
  pagination.value.page = page
  fetchTasks()
}

const formatDate = (date: string | null) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchTasks()
})
</script>
