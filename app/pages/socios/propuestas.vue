<template>
  <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Propuestas</h1>
        <p class="text-muted-foreground mt-1">
          Vota y participa en las propuestas de la asociación
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
          <NuxtLink to="/socios/propuesta/nueva">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Nueva propuesta
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
            <SelectItem v-for="(label, key) in proposalStatusLabels" :key="key" :value="key">
              {{ label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div class="w-full sm:w-auto flex-1 sm:max-w-sm">
        <Label>Búsqueda</Label>
        <Input 
          v-model="filters.search" 
          placeholder="Buscar en título o resumen..." 
          @keyup.enter="refresh"
        />
      </div>
      
      <Button @click="refresh" variant="outline" size="icon">
        <Icon name="lucide:refresh-cw" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Tabla de propuestas -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead class="w-[200px]">Responsable</TableHead>
            <TableHead class="w-[100px]">Estado</TableHead>
            <TableHead class="w-[120px] text-center">Votos 👍/👎</TableHead>
            <TableHead class="w-[100px]">Creada</TableHead>
            <TableHead class="w-[100px] text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow 
            v-for="proposal in proposals" 
            :key="proposal.id"
            class="cursor-pointer hover:bg-muted/50"
            @click="navigateTo(`/socios/propuesta/${proposal.id}`)"
          >
            <TableCell>
              <div class="font-medium max-w-[300px] truncate">{{ proposal.title }}</div>
              <div class="text-sm text-muted-foreground max-w-[300px] truncate">{{ proposal.summary }}</div>
            </TableCell>
            <TableCell>
              <div class="text-sm">
                {{ proposal.creator.firstName }} {{ proposal.creator.lastName }}
              </div>
              <div v-if="proposal.responsibles.length > 0" class="text-xs text-muted-foreground">
                +{{ proposal.responsibles.length }} responsables
              </div>
            </TableCell>
            <TableCell>
              <Badge :class="proposalStatusColors[proposal.status]">
                {{ proposalStatusLabels[proposal.status] }}
              </Badge>
            </TableCell>
            <TableCell class="text-center">
              <div class="flex items-center justify-center gap-2">
                <span class="text-green-600 font-medium">{{ proposal.upVotes }}</span>
                <span class="text-muted-foreground">/</span>
                <span class="text-red-600 font-medium">{{ proposal.downVotes }}</span>
              </div>
            </TableCell>
            <TableCell>{{ formatDate(proposal.createdAt) }}</TableCell>
            <TableCell class="text-center" @click.stop>
              <div class="flex items-center justify-center gap-1">
                <Button 
                  v-if="!proposal.userVoted && proposal.status === 'VOTANDO'"
                  variant="outline" 
                  size="sm"
                  @click="openVoteDialog(proposal)"
                >
                  <Icon name="lucide:thumbs-up" class="h-4 w-4 mr-1" />
                  Votar
                </Button>
                <Button 
                  v-else-if="proposal.userVoted"
                  variant="ghost" 
                  size="sm"
                  disabled
                  class="text-green-600"
                >
                  <Icon name="lucide:check" class="h-4 w-4 mr-1" />
                  Votado
                </Button>
                <Button 
                  v-if="canDelete(proposal)"
                  variant="ghost" 
                  size="icon"
                  class="text-red-500 hover:text-red-700"
                  @click="confirmDelete(proposal)"
                >
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          
          <TableRow v-if="proposals.length === 0">
            <TableCell colspan="6" class="h-24 text-center text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:inbox" class="h-8 w-8 opacity-50" />
                <p>No hay propuestas disponibles</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between" v-if="pagination.total > 0">
      <p class="text-sm text-muted-foreground">
        Mostrando {{ proposals.length }} de {{ pagination.total }} propuestas
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

    <!-- Dialog de Votación -->
    <Dialog v-model:open="voteDialog.open">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Votar propuesta</DialogTitle>
          <DialogDescription>
            {{ voteDialog.proposal?.title }}
          </DialogDescription>
        </DialogHeader>
        
        <div class="py-4">
          <p class="text-sm text-muted-foreground mb-4">
            {{ voteDialog.proposal?.summary }}
          </p>
          <div class="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg"
              class="flex-1 border-green-500 hover:bg-green-50"
              :disabled="voteDialog.loading"
              @click="submitVote('UP')"
            >
              <Icon name="lucide:thumbs-up" class="h-6 w-6 mr-2 text-green-600" />
              A favor
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              class="flex-1 border-red-500 hover:bg-red-50"
              :disabled="voteDialog.loading"
              @click="submitVote('DOWN')"
            >
              <Icon name="lucide:thumbs-down" class="h-6 w-6 mr-2 text-red-600" />
              En contra
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="voteDialog.open = false">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Dialog de Confirmación de Eliminación -->
    <Dialog v-model:open="deleteDialog.open">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-red-600">Eliminar propuesta</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta propuesta? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        
        <div class="py-4" v-if="deleteDialog.proposal">
          <p class="font-medium">{{ deleteDialog.proposal.title }}</p>
          <p class="text-sm text-muted-foreground">{{ deleteDialog.proposal.summary }}</p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="deleteDialog.open = false">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            :disabled="deleteDialog.loading"
            @click="deleteProposal"
          >
            <Icon v-if="deleteDialog.loading" name="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { toast } from 'vue-sonner'
const { user } = await useUserSession()

// Tipos
interface Proposal {
  id: string
  title: string
  summary: string
  status: 'VOTANDO' | 'ACEPTADA' | 'RECHAZADA'
  createdAt: string
  creator: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  responsibles: any[]
  upVotes: number
  downVotes: number
  userVoted: boolean
  userVoteType: 'UP' | 'DOWN' | null
}

// Labels y colores
const proposalStatusLabels: Record<string, string> = {
  VOTANDO: 'En votación',
  ACEPTADA: 'Aceptada',
  RECHAZADA: 'Rechazada'
}

const proposalStatusColors: Record<string, string> = {
  VOTANDO: 'bg-blue-100 text-blue-800',
  ACEPTADA: 'bg-green-100 text-green-800',
  RECHAZADA: 'bg-red-100 text-red-800'
}

// Estado
const proposals = ref<Proposal[]>([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: false
})

const filters = ref({
  status: 'ALL',
  search: ''
})

const voteDialog = ref({
  open: false,
  proposal: null as Proposal | null,
  loading: false
})

const deleteDialog = ref({
  open: false,
  proposal: null as Proposal | null,
  loading: false
})

// Verificar si puede eliminar (creador o admin)
const canDelete = (proposal: Proposal) => {
  const isCreator = proposal.creator.id === user.value?.id
  const isAdmin = user.value?.role === 'ADMIN' || user.value?.role === 'ROOT'
  return isCreator || isAdmin
}

// Cargar propuestas
const fetchProposals = async () => {
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.value.page.toString())
    params.append('limit', pagination.value.limit.toString())
    
    if (filters.value.status && filters.value.status !== 'ALL') params.append('status', filters.value.status)
    if (filters.value.search) params.append('search', filters.value.search)
    
    const data = await $fetch<{ proposals: Proposal[], pagination: any }>(`/api/proposals?${params}`)
    
    if (data) {
      proposals.value = data.proposals
      pagination.value = data.pagination
    }
  } catch (error) {
    console.error('Error cargando propuestas:', error)
    proposals.value = []
  }
}

const refresh = () => {
  pagination.value.page = 1
  fetchProposals()
}

const changePage = (page: number) => {
  pagination.value.page = page
  fetchProposals()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Votar
const openVoteDialog = (proposal: Proposal) => {
  voteDialog.value.proposal = proposal
  voteDialog.value.open = true
}

const submitVote = async (type: 'UP' | 'DOWN') => {
  if (!voteDialog.value.proposal) return
  
  voteDialog.value.loading = true
  try {
    await $fetch(`/api/proposals/${voteDialog.value.proposal.id}/vote`, {
      method: 'POST',
      body: { type }
    })
    
    toast.success('Voto registrado', {
      description: `Has votado ${type === 'UP' ? 'a favor' : 'en contra'} de la propuesta`,
    })
    
    voteDialog.value.open = false
    fetchProposals()
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo registrar el voto',
    })
  } finally {
    voteDialog.value.loading = false
  }
}

// Eliminar
const confirmDelete = (proposal: Proposal) => {
  deleteDialog.value.proposal = proposal
  deleteDialog.value.open = true
}

const deleteProposal = async () => {
  if (!deleteDialog.value.proposal) return
  
  deleteDialog.value.loading = true
  try {
    await $fetch(`/api/proposals/${deleteDialog.value.proposal.id}`, {
      method: 'DELETE'
    })
    
    toast.success('Propuesta eliminada', {
      description: 'La propuesta ha sido eliminada correctamente',
    })
    
    deleteDialog.value.open = false
    fetchProposals()
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'No se pudo eliminar la propuesta',
      variant: 'destructive',
    })
  } finally {
    deleteDialog.value.loading = false
  }
}

onMounted(() => {
  fetchProposals()
})
</script>
