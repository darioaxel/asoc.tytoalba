<template>
  <div class="max-w-6xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold">Lista de Morosos</h1>
        <p class="text-muted-foreground mt-1">
          Socios con deudas pendientes{{ data?.monthName ? ` - ${data.monthName}` : '' }}
        </p>
      </div>
      <div class="flex gap-2">
        <Button @click="downloadPDF" variant="outline">
          <Icon name="lucide:file-down" class="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
        <Button variant="outline" as-child>
          <NuxtLink to="/socios">
            <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
            Volver
          </NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Error -->
    <Alert v-else-if="error" variant="destructive">
      <Icon name="lucide:alert-circle" class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        No se pudo cargar la lista de morosos. Inténtalo de nuevo.
      </AlertDescription>
    </Alert>

    <!-- Content -->
    <template v-else-if="data && data.summary">
      <!-- Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Socios con deuda</CardDescription>
            <CardTitle class="text-3xl">{{ data.summary.totalSocios || 0 }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Total recibos pendientes</CardDescription>
            <CardTitle class="text-3xl">{{ data.summary.totalRecibos || 0 }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Importe total adeudado</CardDescription>
            <CardTitle class="text-3xl text-destructive">{{ formatCurrency(data.summary.totalDebt || 0) }}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <!-- Lista de morosos -->
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Socio</CardTitle>
          <CardDescription>
            Listado de socios con recibos pendientes o devueltos del mes en curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="!data.morosos || data.morosos.length === 0" class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:check-circle" class="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No hay socios con deudas pendientes este mes</p>
          </div>

          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Socio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead class="text-right">Recibos</TableHead>
                <TableHead class="text-right">Deuda Total</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="moroso in data.morosos" :key="moroso.userId">
                <TableCell>
                  <div class="font-medium">{{ moroso.firstName }} {{ moroso.lastName }}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{{ formatMemberType(moroso.memberType) }}</Badge>
                </TableCell>
                <TableCell>
                  <div class="text-sm text-muted-foreground">
                    <div v-if="moroso.phone">{{ moroso.phone }}</div>
                    <div v-if="moroso.email" class="text-xs">{{ moroso.email }}</div>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <Badge variant="secondary">{{ moroso.receiptCount }}</Badge>
                </TableCell>
                <TableCell class="text-right">
                  <span class="font-semibold text-destructive">{{ formatCurrency(moroso.totalDebt) }}</span>
                </TableCell>
                <TableCell class="text-right">
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button variant="ghost" size="sm" @click="selectedMoroso = moroso">
                        <Icon name="lucide:eye" class="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent class="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detalle de Deuda</DialogTitle>
                        <DialogDescription>
                          {{ moroso.firstName }} {{ moroso.lastName }} - Total: {{ formatCurrency(moroso.totalDebt) }}
                        </DialogDescription>
                      </DialogHeader>
                      <div class="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nº Recibo</TableHead>
                              <TableHead>Concepto</TableHead>
                              <TableHead>Vencimiento</TableHead>
                              <TableHead class="text-right">Importe</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow v-for="receipt in moroso.receipts" :key="receipt.number">
                              <TableCell class="font-mono text-sm">{{ receipt.number }}</TableCell>
                              <TableCell>{{ receipt.concept }}</TableCell>
                              <TableCell>{{ formatDate(receipt.dueDate) }}</TableCell>
                              <TableCell class="text-right">
                                <span :class="receipt.status === 'RETURNED' ? 'text-destructive' : ''">
                                  {{ formatCurrency(receipt.debt) }}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter class="flex justify-between border-t pt-6">
          <div class="text-sm text-muted-foreground">
            Total de socios: <strong>{{ data.summary?.totalSocios || 0 }}</strong>
          </div>
          <div class="text-lg font-bold">
            Total adeudado: <span class="text-destructive">{{ formatCurrency(data.summary?.totalDebt || 0) }}</span>
          </div>
        </CardFooter>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
  roles: ['ADMIN', 'ROOT']
})

// Estado
const selectedMoroso = ref(null)

// Fetch datos
const { data: response, pending, error } = await useLazyFetch('/api/admin/morosos')

// Extraer datos de la respuesta
const data = computed(() => response.value?.data || null)

// Formato de moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

// Formato de fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Formato de tipo de socio
const formatMemberType = (type: string) => {
  const types: Record<string, string> = {
    'NORMAL': 'Normal',
    'JUVENIL': 'Juvenil',
    'FUNDADOR': 'Fundador'
  }
  return types[type] || type
}

// Descargar PDF
const downloadPDF = async () => {
  try {
    const response = await $fetch('/api/admin/morosos/pdf', {
      responseType: 'blob'
    })
    
    // Crear URL del blob
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    
    // Crear link de descarga
    const link = document.createElement('a')
    link.href = url
    link.download = `morosos_${new Date().getFullYear()}_${new Date().getMonth() + 1}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Liberar URL
    window.URL.revokeObjectURL(url)
    
    toast.success('PDF descargado', {
      description: 'El archivo se ha descargado correctamente'
    })
  } catch (error) {
    console.error('Error descargando PDF:', error)
    toast.error('Error', {
      description: 'No se pudo descargar el PDF'
    })
  }
}
</script>
