<!-- pages/dashboard/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
    <!-- Header personalizado -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold">¡Hola {{ userName }}! 👋</h1>
      <p class="text-lg text-muted-foreground">Bienvenido a tu portal de la asociación</p>
    </div>

    <!-- Carrusel de noticias -->
    <div class="relative">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">Últimas noticias</h2>
        <Button variant="ghost" size="sm" as-child>
          <NuxtLink to="/blog">Ver todas</NuxtLink>
        </Button>
      </div>

      <Carousel
        class="w-full max-w-4xl mx-auto"
        :opts="{ align: 'start', loop: true }"
        :plugins="plugins"
        @init="onInit"
      >
        <CarouselContent>
          <CarouselItem
            v-for="post in latestPosts"
            :key="post.id"
            class="md:basis-1/2 lg:basis-1/3"
          >
            <div class="p-1">
              <Card class="h-full">
                <CardContent class="p-4 flex flex-col h-full">
                  <div
                    class="aspect-video w-full bg-cover bg-center rounded-md mb-4"
                    :style="{ backgroundImage: `url(${post.cover})` }"
                  />
                  <div class="flex-1">
                    <h3 class="font-semibold mb-2">{{ post.title }}</h3>
                    <p class="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {{ post.excerpt }}
                    </p>

                    <div class="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Avatar class="h-4 w-4">
                        <AvatarImage :src="post.author?.picture" />
                        <AvatarFallback>
                          {{ post.author?.firstName?.charAt(0) || '?' }}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {{
                          post.author
                            ? `${post.author.firstName} ${post.author.lastName}`
                            : 'Autor desconocido'
                        }}
                      </span>
                      <span>•</span>
                      <time>{{ formatDate(post.publishedAt) }}</time>
                    </div>

                    <div class="flex flex-wrap gap-1 mb-3">
                      <Badge
                        v-for="tag in post.tags"
                        :key="tag.slug"
                        variant="secondary"
                        class="text-xs"
                      >
                        {{ tag.name }}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    @click="navigateTo(`/blog/${post.slug}`)"
                    size="sm"
                    class="w-full"
                  >
                    Leer más
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

    <!-- SECCIÓN DE TAREAS (Reemplaza los cards anteriores) -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold">Mis Tareas</h2>
          <p class="text-muted-foreground">Gestiona tus tareas pendientes y seguimiento</p>
        </div>
        
        <!-- Contador de seleccionadas (solo admin) -->
        <div v-if="isAdmin && selectedTasks.length > 0" class="flex items-center gap-2">
          <Badge variant="secondary">
            {{ selectedTasks.length }} tarea(s) seleccionada(s)
          </Badge>
          <Button 
            variant="default" 
            size="sm"
            @click="validateSelectedTasks"
            :disabled="validating"
          >
            <Icon v-if="validating" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="lucide:check-circle" class="mr-2 h-4 w-4" />
            Validar seleccionadas
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
            @keyup.enter="refreshTasks"
          />
        </div>
        
        <Button @click="refreshTasks" variant="outline" size="icon">
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        </Button>
      </div>

      <!-- Tabla de Tareas -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <!-- Checkbox para selección múltiple (solo admin) -->
              <TableHead v-if="isAdmin" class="w-[50px]">
                <Checkbox 
                  :checked="isAllSelected" 
                  @update:checked="toggleSelectAll"
                />
              </TableHead>
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
            <TableRow 
              v-for="task in tasks" 
              :key="task.id" 
              class="cursor-pointer hover:bg-muted/50"
              :class="{ 'bg-muted/30': isSelected(task.id) }"
              @click="navigateTo(`/tasks/${task.id}`)"
            >
              <!-- Checkbox (solo admin, click.stop para evitar navegación) -->
              <TableCell v-if="isAdmin" @click.stop>
                <Checkbox 
                  :checked="isSelected(task.id)"
                  @update:checked="toggleSelection(task.id)"
                />
              </TableCell>
              
              <TableCell class="font-medium">
                {{ task.shortDesc }}
                <span v-if="task._count?.assignees > 1" class="text-xs text-muted-foreground ml-1">
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
              <TableCell :colspan="isAdmin ? 8 : 7" class="h-24 text-center text-muted-foreground">
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

      <!-- Botones de acción inferior -->
      <div class="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" @click="navigateTo('/tasks')">
          Ver todas las tareas
          <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4" />
        </Button>
        
        <Button @click="navigateTo('/tasks/new')" size="lg">
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
          Crear nueva tarea
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'
import type { TaskWithRelations } from '~/types/task'
import { 
  taskStatusLabels, 
  taskTypeLabels, 
  taskStatusColors, 
  taskTypeColors 
} from '~/types/task'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

/* ----------  Usuario y Permisos ---------- */
const { user } = await useUserSession()
const userName = computed(() => {
  if (!user.value) return 'Usuario'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email
})

const isAdmin = computed(() => user.value?.role === 'ADMIN')

/* ----------  Posts (Carrusel) ---------- */
const { data: postsData } = await useLazyFetch('/api/posts/latest', {
  query: { limit: 5 },
})
const latestPosts = computed(() => postsData.value?.posts ?? [])

function formatDate(d: string | Date | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/* ----------  Tareas ---------- */
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

// Selección múltiple (solo para admin)
const selectedTasks = ref<string[]>([])
const validating = ref(false)

const isAllSelected = computed(() => {
  return tasks.value.length > 0 && selectedTasks.value.length === tasks.value.length
})

const isSelected = (id: string) => selectedTasks.value.includes(id)

const toggleSelection = (id: string) => {
  const index = selectedTasks.value.indexOf(id)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTasks.value = []
  } else {
    selectedTasks.value = tasks.value.map(t => t.id)
  }
}

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
    // Limpiar selección al cambiar de página
    selectedTasks.value = []
  }
}

const refreshTasks = () => {
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

// Validación múltiple (solo admin)
const validateSelectedTasks = async () => {
  if (selectedTasks.value.length === 0) return
  
  validating.value = true
  try {
    // Llamada API para validar múltiples tareas
    await $fetch('/api/tasks/validate-batch', {
      method: 'POST',
      body: { taskIds: selectedTasks.value }
    })
    
    toast.success(`${selectedTasks.value.length} tareas validadas correctamente`)
    selectedTasks.value = []
    await fetchTasks()
  } catch (error) {
    toast.error('Error al validar tareas')
  } finally {
    validating.value = false
  }
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

/* ----------  Autoplay Carrusel ---------- */
const plugins = [Autoplay({ delay: 3000 })]
function onInit(api: any) {
  // api disponible si se necesita control manual
}

// Cargar tareas al montar
onMounted(() => {
  fetchTasks()
})
</script>