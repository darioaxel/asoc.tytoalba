<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex flex-col gap-6">
      <!-- Header con deuda -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Mis Recibos</h1>
          <p class="text-muted-foreground">
            Gestiona tus cuotas y pagos pendientes
          </p>
        </div>
        
        <Card v-if="debt > 0" class="bg-destructive/10 border-destructive">
          <CardContent class="flex items-center gap-4 py-4">
            <AlertCircle class="h-6 w-6 text-destructive" />
            <div>
              <p class="text-sm text-muted-foreground">Deuda pendiente total</p>
              <p class="text-2xl font-bold text-destructive">{{ formatCurrency(debt) }}</p>
            </div>
            <Button 
              v-if="pendingReceipts.length > 0"
              :to="`/pagar-recibo/${pendingReceipts[0].id}`"
              class="ml-4"
            >
              Pagar ahora
            </Button>
          </CardContent>
        </Card>
        
        <Card v-else class="bg-green-50 border-green-200">
          <CardContent class="flex items-center gap-4 py-4">
            <CheckCircle class="h-6 w-6 text-green-600" />
            <div>
              <p class="text-sm text-muted-foreground">Estado de cuenta</p>
              <p class="text-lg font-semibold text-green-700">Al día con los pagos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Tabs por año -->
      <Tabs :default-value="currentYear" @update:model-value="onTabChange">
        <TabsList class="grid w-full grid-cols-3 md:w-fit">
          <TabsTrigger 
            v-for="year in availableYears" 
            :key="year" 
            :value="year"
          >
            {{ year }}
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          v-for="year in availableYears" 
          :key="year" 
          :value="year"
          class="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recibos {{ year }}</CardTitle>
              <CardDescription>
                {{ receipts.length }} recibos encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table v-if="receipts.length > 0">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recibo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Fecha emisión</TableHead>
                    <TableHead>Fecha vencimiento</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead class="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow 
                    v-for="receipt in receipts" 
                    :key="receipt.id"
                    :class="{ 'bg-muted/50': receipt.isLocked }"
                  >
                    <TableCell class="font-medium">
                      {{ receipt.number }}
                    </TableCell>
                    <TableCell>{{ receipt.concept }}</TableCell>
                    <TableCell>{{ formatDate(receipt.issueDate) }}</TableCell>
                    <TableCell>{{ formatDate(receipt.dueDate) }}</TableCell>
                    <TableCell>{{ formatCurrency(receipt.totalAmount) }}</TableCell>
                    <TableCell>
                      <Badge :variant="getStatusVariant(receipt.status)">
                        {{ getStatusLabel(receipt.status) }}
                      </Badge>
                      <span v-if="receipt.isLocked" class="ml-2 text-xs text-muted-foreground">
                        (Bloqueado)
                      </span>
                    </TableCell>
                    <TableCell class="text-right">
                      <div class="flex justify-end gap-2">
                        <Button
                          v-if="canPay(receipt)"
                          size="sm"
                          :to="`/pagar-recibo/${receipt.id}`"
                        >
                          Pagar
                        </Button>
                        <Button
                          v-else-if="receipt.status === 'UNDER_REVIEW'"
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          En trámite
                        </Button>
                        <Button
                          v-else-if="receipt.status === 'FULLY_PAID'"
                          size="sm"
                          variant="ghost"
                          @click="downloadReceipt(receipt)"
                        >
                          <Download class="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div v-else class="text-center py-12 text-muted-foreground">
                <Receipt class="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No hay recibos para el año {{ year }}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  AlertCircle, 
  CheckCircle, 
  Download, 
  Receipt 
} from 'lucide-vue-next'
import { useMyReceipts } from '~/composables/useMyReceipts'

definePageMeta({
  middleware: ['auth'],
  title: 'Mis Recibos',
  layout: 'dashboard',
})

const {
  receipts,
  debt,
  currentYear,
  availableYears,
  pendingReceipts,
  loading,
  fetchReceipts,
  getStatusLabel,
  getStatusVariant,
} = useMyReceipts()

// Cargar recibos del año actual al montar
onMounted(() => {
  fetchReceipts(currentYear)
})

const onTabChange = (year: string | number) => {
  fetchReceipts(Number(year))
}

const canPay = (receipt: Receipt) => {
  return receipt.status === 'PENDING' && !receipt.isLocked
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const downloadReceipt = (receipt: Receipt) => {
  // Implementar descarga de recibo
  console.log('Descargar recibo:', receipt.number)
}
</script>