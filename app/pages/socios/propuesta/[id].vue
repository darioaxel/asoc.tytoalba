<template>
  <div class="max-w-4xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <Button variant="outline" as-child>
        <NuxtLink to="/socios/propuestas">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a propuestas
        </NuxtLink>
      </Button>
      <div class="flex gap-2">
        <Button 
          v-if="canDelete"
          variant="destructive"
          @click="confirmDelete"
        >
          <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Content -->
    <div v-else-if="proposal" class="space-y-6">
      <!-- Título y estado -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">{{ proposal.title }}</h1>
          <p class="text-muted-foreground mt-2">
            Creada por {{ proposal.creator.firstName }} {{ proposal.creator.lastName }} 
            el {{ formatDate(proposal.createdAt) }}
          </p>
        </div>
        <Badge :class="proposalStatusColors[proposal.status]" class="text-sm">
          {{ proposalStatusLabels[proposal.status] }}
        </Badge>
      </div>

      <!-- Resumen -->
      <Card class="bg-muted/50">
        <CardContent class="pt-6">
          <h2 class="font-semibold mb-2">Resumen</h2>
          <p class="text-muted-foreground">{{ proposal.summary }}</p>
        </CardContent>
      </Card>

      <!-- Votación y días restantes -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Card de votos -->
        <Card :class="proposal.userVoted ? 'border-green-500' : ''">
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Icon name="lucide:bar-chart-3" class="h-5 w-5" />
              Votación
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-center gap-8">
              <div class="text-center">
                <Icon name="lucide:thumbs-up" class="h-8 w-8 text-green-600 mx-auto mb-1" />
                <p class="text-2xl font-bold text-green-600">{{ proposal.upVotes }}</p>
                <p class="text-xs text-muted-foreground">A favor</p>
              </div>
              <div class="text-center">
                <Icon name="lucide:thumbs-down" class="h-8 w-8 text-red-600 mx-auto mb-1" />
                <p class="text-2xl font-bold text-red-600">{{ proposal.downVotes }}</p>
                <p class="text-xs text-muted-foreground">En contra</p>
              </div>
            </div>
            
            <div v-if="proposal.status === 'VOTANDO'" class="pt-2">
              <Button 
                v-if="!proposal.userVoted"
                class="w-full"
                @click="voteDialog.open = true"
              >
                <Icon name="lucide:vote" class="mr-2 h-4 w-4" />
                Votar ahora
              </Button>
              <div v-else class="text-center text-green-600 text-sm">
                <Icon name="lucide:check-circle" class="h-4 w-4 inline mr-1" />
                Ya has votado {{ proposal.userVoteType === 'UP' ? 'a favor' : 'en contra' }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Card de días restantes -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Icon name="lucide:calendar-clock" class="h-5 w-5" />
              Tiempo restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="proposal.status === 'VOTANDO' && proposal.daysRemaining !== null" class="text-center">
              <p class="text-3xl font-bold" :class="proposal.daysRemaining > 0 ? 'text-blue-600' : 'text-red-600'">
                {{ proposal.daysRemaining > 0 ? proposal.daysRemaining : 0 }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ proposal.daysRemaining === 1 ? 'día restante' : 'días restantes' }}
              </p>
            </div>
            <div v-else-if="proposal.endDate" class="text-center">
              <p class="text-sm text-muted-foreground">Votación finalizada</p>
              <p class="text-lg">{{ formatDate(proposal.endDate) }}</p>
            </div>
            <div v-else class="text-center text-muted-foreground">
              Sin fecha de cierre definida
            </div>
          </CardContent>
        </Card>

        <!-- Card de responsables -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Icon name="lucide:users" class="h-5 w-5" />
              Responsables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <Avatar class="h-8 w-8">
                  <AvatarFallback>{{ getInitials(proposal.creator.firstName, proposal.creator.lastName) }}</AvatarFallback>
                </Avatar>
                <div class="text-sm">
                  <p class="font-medium">{{ proposal.creator.firstName }} {{ proposal.creator.lastName }}</p>
                  <p class="text-xs text-muted-foreground">Creador</p>
                </div>
              </div>
              <div 
                v-for="responsible in proposal.responsibles" 
                :key="responsible.user.id"
                class="flex items-center gap-2"
              >
                <Avatar class="h-8 w-8">
                  <AvatarFallback>{{ getInitials(responsible.user.firstName, responsible.user.lastName) }}</AvatarFallback>
                </Avatar>
                <div class="text-sm">
                  <p class="font-medium">{{ responsible.user.firstName }} {{ responsible.user.lastName }}</p>
                  <p class="text-xs text-muted-foreground">Responsable</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Quién ha votado -->
      <Card v-if="proposal.votes.length > 0">
        <CardHeader>
          <CardTitle class="text-lg">Votos registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Badge 
              v-for="vote in proposal.votes" 
              :key="vote.id"
              :class="vote.type === 'UP' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
              class="cursor-default"
            >
              <Icon 
                :name="vote.type === 'UP' ? 'lucide:thumbs-up' : 'lucide:thumbs-down'" 
                class="h-3 w-3 mr-1" 
              />
              {{ vote.user.firstName }} {{ vote.user.lastName }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Descripción completa -->
      <Card>
        <CardHeader>
          <CardTitle>Descripción completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="prose prose-sm max-w-none whitespace-pre-wrap">
            {{ proposal.description }}
          </div>
        </CardContent>
      </Card>

      <!-- Imágenes -->
      <Card v-if="proposal.images && proposal.images.length > 0">
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div 
              v-for="image in proposal.images" 
              :key="image.id"
              class="aspect-square rounded-md overflow-hidden border cursor-pointer hover:opacity-90"
              @click="openImage(image.url)"
            >
              <img 
                :src="image.url" 
                :alt="image.originalName"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Documentos -->
      <Card v-if="proposal.documents && proposal.documents.length > 0">
        <CardHeader>
          <CardTitle>Documentos adjuntos</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div 
              v-for="doc in proposal.documents" 
              :key="doc.id"
              class="flex items-center justify-between p-3 bg-muted rounded-md"
            >
              <div class="flex items-center gap-3">
                <Icon name="lucide:file-text" class="h-5 w-5 text-muted-foreground" />
                <div>
                  <p class="text-sm font-medium">{{ doc.originalName }}</p>
                  <p class="text-xs text-muted-foreground">{{ formatFileSize(doc.size) }}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" as-child>
                <a :href="doc.url" download :download="doc.originalName">
                  <Icon name="lucide:download" class="h-4 w-4 mr-1" />
                  Descargar
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Fechas -->
      <Card>
        <CardHeader>
          <CardTitle>Fechas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-muted-foreground">Creación</p>
              <p class="font-medium">{{ formatDate(proposal.createdAt) }}</p>
            </div>
            <div v-if="proposal.startDate">
              <p class="text-muted-foreground">Inicio / Realización</p>
              <p class="font-medium">{{ formatDate(proposal.startDate) }}</p>
            </div>
            <div v-if="proposal.endDate">
              <p class="text-muted-foreground">Cierre de votación</p>
              <p class="font-medium">{{ formatDate(proposal.endDate) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <Icon name="lucide:file-x" class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p class="text-muted-foreground">Propuesta no encontrada</p>
      <Button class="mt-4" as-child>
        <NuxtLink to="/socios/propuestas">Volver a propuestas</NuxtLink>
      </Button>
    </div>

    <!-- Dialog de Votación -->
    <Dialog v-model:open="voteDialog.open">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Votar propuesta</DialogTitle>
          <DialogDescription>
            ¿Estás a favor o en contra de esta propuesta?
          </DialogDescription>
        </DialogHeader>
        
        <div class="py-4">
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

    <!-- Dialog de imagen ampliada -->
    <Dialog v-model:open="imageDialog.open">
      <DialogContent class="max-w-4xl p-0 overflow-hidden">
        <img 
          :src="imageDialog.url" 
          class="w-full h-auto max-h-[80vh] object-contain"
          alt="Imagen ampliada"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '#components'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'vue-sonner'
const route = useRoute()
const router = useRouter()
const { user } = await useUserSession()

const proposalId = route.params.id as string

// Estado
const loading = ref(true)
const proposal = ref<any>(null)

const voteDialog = ref({
  open: false,
  loading: false
})

const deleteDialog = ref({
  open: false,
  loading: false
})

const imageDialog = ref({
  open: false,
  url: ''
})

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

// Computed
const canDelete = computed(() => {
  if (!proposal.value || !user.value) return false
  const isCreator = proposal.value.creator.id === user.value.id
  const isAdmin = user.value.role === 'ADMIN' || user.value.role === 'ROOT'
  return isCreator || isAdmin
})

// Métodos
const fetchProposal = async () => {
  loading.value = true
  try {
    const data = await $fetch(`/api/proposals/${proposalId}`)
    proposal.value = data.proposal
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo cargar la propuesta',
    })
    proposal.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getInitials = (firstName?: string, lastName?: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const openImage = (url: string) => {
  imageDialog.value.url = url
  imageDialog.value.open = true
}

// Votar
const submitVote = async (type: 'UP' | 'DOWN') => {
  voteDialog.value.loading = true
  try {
    await $fetch(`/api/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: { type }
    })
    
    toast.success('Voto registrado', {
      description: `Has votado ${type === 'UP' ? 'a favor' : 'en contra'} de la propuesta`,
    })
    
    voteDialog.value.open = false
    fetchProposal()
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo registrar el voto',
    })
  } finally {
    voteDialog.value.loading = false
  }
}

// Eliminar
const confirmDelete = () => {
  deleteDialog.value.open = true
}

const deleteProposal = async () => {
  deleteDialog.value.loading = true
  try {
    await $fetch(`/api/proposals/${proposalId}`, {
      method: 'DELETE'
    })
    
    toast.success('Propuesta eliminada', {
      description: 'La propuesta ha sido eliminada correctamente',
    })
    
    router.push('/socios/propuestas')
  } catch (error: any) {
    toast.error('Error', {
      description: error.message || 'No se pudo eliminar la propuesta',
    })
  } finally {
    deleteDialog.value.loading = false
    deleteDialog.value.open = false
  }
}

onMounted(() => {
  fetchProposal()
})
</script>
