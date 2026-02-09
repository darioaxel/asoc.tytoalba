// composables/usePayment.ts
import type { Receipt } from './useMyReceipts'
import type { UploadedFile } from '~/types/payments' 

export function usePayment() {
  // Estado global con valores por defecto seguros
  const pendingReceipts = useState<Receipt[]>('payment:receipts', () => [])
  const selectedIds = useState<Set<string>>('payment:selected', () => new Set())
  const uploadedFile = useState<UploadedFile | null>('payment:file', () => null)
  const loading = useState('payment:loading', () => false)
  const submitting = useState('payment:submitting', () => false)

  // Getters computados con valores por defecto
  const items = computed(() => {
    if (!pendingReceipts.value?.length) return []
    return pendingReceipts.value.map(r => ({
      receipt: r,
      selected: selectedIds.value?.has(r.id) || false
    }))
  })

  const selectedReceipts = computed(() => {
    if (!pendingReceipts.value?.length) return []
    return pendingReceipts.value.filter(r => selectedIds.value?.has(r.id))
  })

  const totalDebt = computed(() => {
    if (!pendingReceipts.value?.length) return 0
    return pendingReceipts.value.reduce((sum, r) => sum + (r?.totalAmount || 0), 0)
  })

  const selectedTotal = computed(() => {
    if (!selectedReceipts.value?.length) return 0
    return selectedReceipts.value.reduce((sum, r) => sum + (r?.totalAmount || 0), 0)
  })

  const remainingAfterPayment = computed(() => 
    Math.max(0, totalDebt.value - selectedTotal.value)
  )

  const canSubmit = computed(() => 
    (selectedIds.value?.size || 0) > 0 && 
    uploadedFile.value != null && 
    !submitting.value
  )

  const isAllSelected = computed(() => 
    pendingReceipts.value?.length > 0 &&
    selectedIds.value?.size === pendingReceipts.value.length
  )

  // Acciones
  function toggleReceipt(id: string) {
    if (!id) return
    const newSet = new Set(selectedIds.value || [])
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    selectedIds.value = newSet
  }

  function toggleAll() {
    if (!pendingReceipts.value?.length) return
    if (isAllSelected.value) {
      selectedIds.value = new Set()
    } else {
      selectedIds.value = new Set(pendingReceipts.value.map(r => r?.id).filter(Boolean))
    }
  }

  function setUploadedFile(file: UploadedFile | null) {
    uploadedFile.value = file
  }

  function clearSelection() {
    selectedIds.value = new Set()
    uploadedFile.value = null
  }

  async function fetchPendingReceipts() {
    loading.value = true
    try {
      const data = await $fetch('/api/receipts/pending')
      pendingReceipts.value = data?.receipts || []
    } catch (e) {
      pendingReceipts.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  async function submitPayment() {
    if (!canSubmit.value) return false

    submitting.value = true
    try {
      await $fetch('/api/receipts/pay', {
        method: 'POST',
        body: {
          receiptIds: Array.from(selectedIds.value || []),
          fileId: uploadedFile.value?.id,
        },
      })
      
      clearSelection()
      await fetchPendingReceipts()
      
      return true
    } finally {
      submitting.value = false
    }
  }

  return {
    pendingReceipts,
    selectedIds,
    uploadedFile,
    loading,
    submitting,
    items,
    selectedReceipts,
    totalDebt,
    selectedTotal,
    remainingAfterPayment,
    canSubmit,
    isAllSelected,
    toggleReceipt,
    toggleAll,
    setUploadedFile,
    clearSelection,
    fetchPendingReceipts,
    submitPayment,
  }
}