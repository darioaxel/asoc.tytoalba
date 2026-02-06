import { ref, computed } from 'vue'

export interface Receipt {
  id: string
  number: string
  fiscalYear: number
  concept: string
  totalAmount: number
  paidAmount: number
  status: 'PENDING' | 'UNDER_REVIEW' | 'FULLY_PAID' | 'RETURNED'
  isLocked: boolean
  issueDate: string
  dueDate: string
  paymentDate?: string
  receiptFiles: Array<{
    file: { name: string; path: string }
  }>
}

export interface ReceiptsResponse {
  receipts: Receipt[]
  debt: number
  year: number
}

export function useMyReceipts() {
  const receipts = ref<Receipt[]>([])
  const debt = ref(0)
  const currentYear = new Date().getFullYear()
  const selectedYear = ref(currentYear)
  const loading = ref(false)

  const availableYears = computed(() => {
    const years = []
    for (let y = currentYear - 2; y <= currentYear; y++) {
      years.push(y)
    }
    return years.reverse()
  })

  const pendingReceipts = computed(() => 
    receipts.value.filter(r => r.status === 'PENDING' && !r.isLocked)
  )

  const fetchReceipts = async (year: number) => {
    loading.value = true
    try {
      const data = await $fetch<ReceiptsResponse>(`/api/receipts/my?year=${year}`)
      receipts.value = data.receipts
      debt.value = data.debt
      selectedYear.value = year
    } finally {
      loading.value = false
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      UNDER_REVIEW: 'En trámite',
      FULLY_PAID: 'Pagado',
      RETURNED: 'Devuelto',
    }
    return labels[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'destructive',
      UNDER_REVIEW: 'warning',
      FULLY_PAID: 'success',
      RETURNED: 'secondary',
    }
    return variants[status] || 'default'
  }

  return {
    receipts,
    debt,
    currentYear,
    selectedYear,
    availableYears,
    pendingReceipts,
    loading,
    fetchReceipts,
    getStatusLabel,
    getStatusVariant,
  }
}