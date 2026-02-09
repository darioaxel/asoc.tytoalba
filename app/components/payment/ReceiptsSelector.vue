<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Recibos pendientes</CardTitle>
          <CardDescription>
            Selecciona los recibos que quieres pagar
          </CardDescription>
        </div>
        <Button 
          v-if="receipts.length > 0"
          variant="outline" 
          size="sm"
          @click="toggleAll"
        >
          {{ isAllSelected ? 'Desmarcar todos' : 'Seleccionar todos' }}
        </Button>
      </div>
    </CardHeader>
    <CardContent class="p-0">
      <div class="max-h-[320px] overflow-auto">
        <Table v-if="receipts.length > 0">
          <TableHeader class="sticky top-0 bg-background">
            <TableRow>
              <TableHead class="w-16 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleAll"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </TableHead>
              <TableHead>Nº Recibo</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead class="text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="item in items" 
              :key="item.receipt.id"
              :class="{ 'bg-primary/5': item.selected }"
              class="cursor-pointer transition-colors"
              @click="toggle(item.receipt.id)"
            >
              <TableCell class="text-center">
                <input
                  type="checkbox"
                  :checked="item.selected"
                  @click.stop
                  @change="toggle(item.receipt.id)"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </TableCell>
              <TableCell class="font-medium">{{ item.receipt.number }}</TableCell>
              <TableCell>{{ item.receipt.concept }}</TableCell>
              <TableCell>{{ formatDate(item.receipt.dueDate) }}</TableCell>
              <TableCell class="text-right font-medium">
                {{ formatCurrency(item.receipt.totalAmount) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div v-else class="text-center py-8 text-muted-foreground">
          <Receipt class="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No hay recibos pendientes de pago</p>
        </div>
      </div>
    </CardContent>
    <CardFooter v-if="receipts.length > 0" class="border-t bg-muted/50 py-3">
      <div class="flex items-center justify-between w-full text-sm">
        <span class="text-muted-foreground">
          {{ selectedCount }} de {{ receipts.length }} seleccionados
        </span>
        <span class="font-semibold text-primary">
          Total a pagar: {{ formatCurrency(selectedTotal) }}
        </span>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Receipt } from 'lucide-vue-next'
import type { Receipt as ReceiptType } from '~/composables/useMyReceipts'

const props = defineProps<{
  receipts: ReceiptType[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedSet = computed({
  get: () => new Set(props.modelValue),
  set: (val) => emit('update:modelValue', Array.from(val))
})

const items = computed(() => 
  props.receipts.map(r => ({
    receipt: r,
    selected: selectedSet.value.has(r.id)
  }))
)

const selectedCount = computed(() => selectedSet.value.size)

const selectedTotal = computed(() => {
  return props.receipts
    .filter(r => selectedSet.value.has(r.id))
    .reduce((sum, r) => {
      const amount = typeof r.totalAmount === 'string' 
        ? parseFloat(r.totalAmount) 
        : Number(r.totalAmount)
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
})

const isAllSelected = computed(() => 
  props.receipts.length > 0 && selectedSet.value.size === props.receipts.length
)

function toggle(id: string) {
  const newSet = new Set(selectedSet.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  selectedSet.value = newSet
}

function toggleAll() {
  if (isAllSelected.value) {
    selectedSet.value = new Set()
  } else {
    selectedSet.value = new Set(props.receipts.map(r => r.id))
  }
}

const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(isNaN(num) ? 0 : num)
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>