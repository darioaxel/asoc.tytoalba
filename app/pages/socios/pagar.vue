<template>
  <div class="container mx-auto py-8 px-4 max-w-4xl">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Pagar recibos</h1>
        <p class="text-muted-foreground">
          Selecciona los recibos y adjunta el justificante de transferencia
        </p>
      </div>

      <!-- Resumen -->
      <PaymentSummary
        :total-debt="totalDebt"
        :total-count="pendingReceipts.length"
        :to-pay="selectedTotal"
        :selected-count="selectedIds.length"
      />

      <!-- Tabla de selección -->
      <ReceiptsSelector
        v-model="selectedIds"
        :receipts="pendingReceipts"
      />

      <!-- Subida de archivo -->
      <FileUpload v-model="uploadedFile" />

      <!-- Botones -->
      <div class="flex justify-end gap-4">
        <Button variant="outline" @click="cancel">
          Cancelar
        </Button>
        <Button
          size="lg"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="submit"
        >
          <CreditCardIcon class="h-4 w-4 mr-2" />
          Confirmar pago
          <span v-if="selectedTotal > 0" class="ml-1">
            ({{ formatCurrency(selectedTotal) }})
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CreditCard as CreditCardIcon } from 'lucide-vue-next'
import PaymentSummary from '~/components/payment/PaymentSummary.vue'
import ReceiptsSelector from '~/components/payment/ReceiptsSelector.vue'
import FileUpload from '~/components/payment/FileUpload.vue'
import type { UploadedFile } from '~/types/payments' 

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
  title: 'Pagar recibo'
})

const pendingReceipts = ref([])
const selectedIds = ref<string[]>([])
const uploadedFile = ref<UploadedFile | null>(null)
const submitting = ref(false)

// Helper para convertir a número
const toNumber = (val: any): number => {
  if (typeof val === 'number') return val
  if (typeof val === 'string') return parseFloat(val) || 0
  return 0
}

const totalDebt = computed(() => 
  pendingReceipts.value?.reduce((sum, r) => {
    const amount = toNumber(r?.totalAmount)
    return sum + amount
  }, 0) || 0
)

const selectedTotal = computed(() => 
  pendingReceipts.value
    ?.filter(r => selectedIds.value.includes(r?.id))
    ?.reduce((sum, r) => {
      const amount = toNumber(r?.totalAmount)
      return sum + amount
    }, 0) || 0
)

const canSubmit = computed(() => 
  selectedIds.value?.length > 0 && uploadedFile.value != null && !submitting.value
)

onMounted(async () => {
  try {
    const data = await $fetch('/api/receipts/pending')
    pendingReceipts.value = data?.receipts || []
  } catch (e) {
    pendingReceipts.value = []
  }
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function cancel() {
  navigateTo('/socios/recibos')
}

async function submit() {
  submitting.value = true
  try {
    await $fetch('/api/receipts/pay', {
      method: 'POST',
      body: {
        receiptIds: selectedIds.value,
        fileId: uploadedFile.value?.id,
      },
    })
    navigateTo('/socios/recibos')
  } finally {
    submitting.value = false
  }
}
</script>