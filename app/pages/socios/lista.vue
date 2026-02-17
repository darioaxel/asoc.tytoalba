<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Lista de Socios</h1>
          <p class="text-muted-foreground">
            Gestión de socios y su estado en la asociación
          </p>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="flex gap-4">
          <Card class="bg-muted/50">
            <CardContent class="flex items-center gap-3 py-3 px-4">
              <Users class="h-5 w-5 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Total socios</p>
                <p class="text-lg font-semibold">{{ socios.length }}</p>
              </div>
            </CardContent>
          </Card>
          <Card class="bg-destructive/10 border-destructive/20">
            <CardContent class="flex items-center gap-3 py-3 px-4">
              <AlertCircle class="h-5 w-5 text-destructive" />
              <div>
                <p class="text-xs text-destructive/80">Con deuda</p>
                <p class="text-lg font-semibold text-destructive">{{ sociosConDeuda }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Búsqueda -->
      <div class="flex gap-4">
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="Buscar por nombre, apellidos, DNI o email..."
            class="pl-10"
            @input="handleSearch"
          />
        </div>
        <Button
          variant="outline"
          :disabled="loading"
          @click="fetchSocios"
        >
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
          Actualizar
        </Button>
      </div>

      <!-- Tabla de socios -->
      <Card>
        <CardHeader>
          <CardTitle>Socios registrados</CardTitle>
          <CardDescription>
            {{ filteredSocios.length }} socio(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="loading" class="space-y-4">
            <Skeleton v-for="i in 5" :key="i" class="h-12 w-full" />
          </div>

          <div v-else-if="filteredSocios.length === 0" class="text-center py-12 text-muted-foreground">
            <Users class="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No se encontraron socios</p>
          </div>

          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Socio</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Método de pago</TableHead>
                <TableHead>Fecha de alta</TableHead>
                <TableHead>Deuda</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="socio in filteredSocios"
                :key="socio.id"
                :class="{ 'bg-muted/30': !socio.activo }"
              >
                <TableCell>
                  <div class="flex items-center gap-3">
                    <Avatar class="h-9 w-9">
                      <AvatarFallback class="bg-primary/10 text-primary text-sm">
                        {{ getInitials(socio.nombre, socio.apellidos) }}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="font-medium">
                        {{ socio.nombre }} {{ socio.apellidos }}
                      </p>
                      <p class="text-sm text-muted-foreground">{{ socio.email }}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="font-mono text-sm">{{ socio.dni || '-' }}</span>
                </TableCell>
                <TableCell>
                  <Badge :variant="getMemberTypeVariant(socio.tipoSocioCode)">
                    {{ socio.tipoSocio }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Badge 
                      :variant="socio.metodoPago === 'CARGO_BANCARIO' ? 'default' : 'secondary'"
                      class="text-xs"
                    >
                      <component 
                        :is="socio.metodoPago === 'CARGO_BANCARIO' ? Landmark : Banknote" 
                        class="h-3 w-3 mr-1"
                      />
                      {{ socio.metodoPago === 'CARGO_BANCARIO' ? 'Domiciliación' : 'Transferencia' }}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {{ formatDate(socio.fechaAlta) }}
                </TableCell>
                <TableCell>
                  <span
                    :class="{
                      'text-destructive font-medium': socio.deudaTotal > 0,
                      'text-green-600': socio.deudaTotal === 0
                    }"
                  >
                    {{ formatCurrency(socio.deudaTotal) }}
                  </span>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Badge :variant="socio.activo ? 'default' : 'secondary'">
                      {{ socio.activo ? 'Activo' : 'Inactivo' }}
                    </Badge>
                    <Badge v-if="socio.rol === 'ROOT'" variant="destructive">ROOT</Badge>
                    <Badge v-else-if="socio.rol === 'ADMIN'" variant="outline">Admin</Badge>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Switch
                            :checked="socio.activo"
                            :disabled="togglingId === socio.id || socio.rol === 'ROOT'"
                            class="data-[state=checked]:!bg-green-500 data-[state=unchecked]:!bg-red-500"
                            @update:checked="toggleUserStatus(socio)"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ socio.activo ? 'Deshabilitar acceso' : 'Habilitar acceso' }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Users,
  AlertCircle,
  Search,
  RefreshCw,
  Landmark,
  Banknote
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Socio {
  id: string
  nombre: string | null
  apellidos: string | null
  dni: string | null
  email: string
  tipoSocio: string
  tipoSocioCode: string | null
  metodoPago: 'TRANSFERENCIA' | 'CARGO_BANCARIO'
  tieneIban: boolean
  fechaAlta: string
  activo: boolean
  rol: string
  deudaTotal: number
}

definePageMeta({
  middleware: ['auth'],
  roles: ['ADMIN', 'ROOT'],
  title: 'Lista de Socios',
  layout: 'dashboard',
})

// Estado
const socios = ref<Socio[]>([])
const loading = ref(false)
const togglingId = ref<string | null>(null)
const searchQuery = ref('')
const debounceTimer = ref<NodeJS.Timeout | null>(null)

// Computed
const filteredSocios = computed(() => {
  if (!searchQuery.value.trim()) return socios.value

  const query = searchQuery.value.toLowerCase()
  return socios.value.filter(socio =>
    (socio.nombre?.toLowerCase() || '').includes(query) ||
    (socio.apellidos?.toLowerCase() || '').includes(query) ||
    (socio.dni?.toLowerCase() || '').includes(query) ||
    socio.email.toLowerCase().includes(query)
  )
})

const sociosConDeuda = computed(() => {
  return socios.value.filter(s => s.deudaTotal > 0).length
})

// Métodos
const fetchSocios = async () => {
  loading.value = true
  try {
    const data = await $fetch<Socio[]>('/api/admin/socios')
    socios.value = data
  } catch (error: any) {
    console.error('Error al cargar socios:', error)
    toast.error(error.message || 'Error al cargar la lista de socios')
  } finally {
    loading.value = false
  }
}

const toggleUserStatus = async (socio: Socio) => {
  // No permitir modificar ROOT desde la interfaz (solo por seguridad extra)
  if (socio.rol === 'ROOT') {
    toast.error('No se puede modificar el estado de un usuario ROOT desde aquí')
    return
  }

  togglingId.value = socio.id
  try {
    const result = await $fetch(`/api/admin/socios/${socio.id}/toggle-status`, {
      method: 'POST'
    })

    // Actualizar el socio en la lista
    const index = socios.value.findIndex(s => s.id === socio.id)
    if (index !== -1) {
      socios.value[index].activo = result.user.isActive
    }

    toast.success(result.message)
  } catch (error: any) {
    console.error('Error al cambiar estado:', error)
    toast.error(error.message || 'Error al cambiar el estado del usuario')
  } finally {
    togglingId.value = null
  }
}

const handleSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  debounceTimer.value = setTimeout(() => {
    // La búsqueda es local, no necesita llamada a API
  }, 300)
}

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || '?'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getMemberTypeVariant = (type: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case 'FUNDADOR':
      return 'default'
    case 'JUVENIL':
      return 'secondary'
    default:
      return 'outline'
  }
}

// Cargar datos al montar
onMounted(() => {
  fetchSocios()
})

// Limpiar timer al desmontar
onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>
