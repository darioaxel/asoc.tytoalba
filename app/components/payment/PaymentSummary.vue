<template>
  <div class="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader class="pb-2">
        <CardDescription>Deuda total</CardDescription>
        <CardTitle class="text-3xl" :class="totalDebt > 0 ? 'text-destructive' : 'text-green-600'">
          {{ formatCurrency(totalDebt) }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-xs text-muted-foreground">
          {{ totalCount }} recibos pendientes
        </p>
      </CardContent>
    </Card>

    <Card :class="{ 'border-primary ring-1 ring-primary': toPay > 0 }">
      <CardHeader class="pb-2">
        <CardDescription>A pagar ahora</CardDescription>
        <CardTitle class="text-3xl text-primary">
          {{ formatCurrency(toPay) }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-xs text-muted-foreground">
          {{ selectedCount }} recibos seleccionados
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardDescription>Quedaría pendiente</CardDescription>
        <CardTitle 
          class="text-3xl"
          :class="remaining === 0 ? 'text-green-600' : ''"
        >
          {{ formatCurrency(remaining) }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-xs text-muted-foreground">
          Después de este pago
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  totalDebt?: number
  totalCount?: number
  toPay?: number
  selectedCount?: number
}>(), {
  totalDebt: 0,
  totalCount: 0,
  toPay: 0,
  selectedCount: 0
})

const remaining = computed(() => Math.max(0, props.totalDebt - props.toPay))

const formatCurrency = (amount: number = 0) => 
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
</script>