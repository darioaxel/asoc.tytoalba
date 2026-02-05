<template>
  <div class="space-y-4">
    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 items-end">
      <div class="w-full sm:w-auto">
        <Label>Estado</Label>
        <Select v-model="filters.status">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
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

    <!-- Tabla -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead class="w-[120px]">Tipo</TableHead>
            <TableHead class="w-[140px]">Estado</TableHead>
            <TableHead class="w-[120px]">Creada</TableHead>
            <TableHead class="w-[120px]">Inicio</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead class="w-[80px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="task in tasks" :key="task.id" class="cursor-pointer hover:bg-muted/50" @click="navigateTo(`/tasks/${task.id}`)">
            <TableCell class="font-medium">
              {{ task.shortDesc }}
              <span v-if="task._count && task._count.assignees > 1" class="text-xs text-muted-foreground ml-1">
                (+{{ task._count.assignees - 1 }})
              </span>
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
            <TableCell>
              <div v-if="task.assignees.length > 0" class="flex items-center gap-2">
                <Avatar class="h-6 w-6">
                  <AvatarFallback class="text-xs">
                    {{ getInitials(task.assignees[0].user) }}
                  </AvatarFallback>
                </Avatar>
                <span class="text-sm truncate max-w-[150px]">
                  {{ getFullName(task.assignees[0].user) }}
                </span>
              </div>
              <span v-else class="text-muted-foreground text-sm">Sin asignar</span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child @click.stop>
                  <Button variant="ghost" size="icon">
                    <Icon name="lucide:more-horizontal" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="navigateTo(`/tasks/${task.id}`)">
                    <Icon name="lucide:eye" class="mr-2 h-4 w-4" />
                    Ver detalle
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="navigateTo(`/tasks/${task.id}/edit`)">
                    <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive" @click="deleteTask(task.id)">
                    <Icon name="lucide:trash" class="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="tasks.length === 0">
            <TableCell colspan="7" class="h-24 text-center text-muted-foreground">
              No se encontraron tareas
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between">
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
import type { TaskWithRelations } from '~/types/task'
import { 
  taskStatusLabels, 
  taskTypeLabels, 
  taskStatusColors, 
  taskTypeColors 
} from '~/types/task'

const router = useRouter()
const tasks = ref<TaskWithRelations[]>([])
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  hasMore: false
})

const filters = ref({
  status: '',
  type: '',
  search: ''
})

const fetchTasks = async () => {
  const params = new URLSearchParams()
  params.append('page', pagination.value.page.toString())
  if (filters.value.status) params.append('status', filters.value.status)
  if (filters.value.type) params.append('type', filters.value.type)
  if (filters.value.search) params.append('search', filters.value.search)
  
  const { data } = await useFetch(`/api/tasks?${params}`)
  if (data.value) {
    tasks.value = data.value.tasks
    pagination.value = data.value.pagination
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

const deleteTask = async (id: string) => {
  if (!confirm('¿Eliminar esta tarea?')) return
  
  await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  await fetchTasks()
}

const formatDate = (date: string | Date | null) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getFullName = (user: any) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user.email
}

const getInitials = (user: any) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }
  return user.email.substring(0, 2).toUpperCase()
}

onMounted(() => {
  fetchTasks()
})
</script>