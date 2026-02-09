import { ReceiptStatus } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const body = await readBody(event)
  const { receiptIds, fileId } = body

  if (!receiptIds?.length || !fileId) {
    throw createError({ 
      statusCode: 400, 
      message: 'Se requieren recibos y justificante de pago' 
    })
  }

  // Verificar que los recibos pertenecen al usuario y están pendientes
  const receipts = await prisma.receipt.findMany({
    where: {
      id: { in: receiptIds },
      userId: session.user.id,
      status: 'PENDING',
      isLocked: false,
      deletedAt: null,
    },
  })

  if (receipts.length !== receiptIds.length) {
    throw createError({ 
      statusCode: 400, 
      message: 'Algunos recibos no son válidos para pago' 
    })
  }

  // Verificar que el archivo existe
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  })

  if (!file) {
    throw createError({ statusCode: 400, message: 'Archivo no encontrado' })
  }

  // Crear pago y actualizar recibos en transacción
  const result = await prisma.$transaction(async (tx) => {
    const totalAmount = receipts.reduce((sum, r) => sum + r.totalAmount, 0)

    // Crear el pago
    const payment = await tx.payment.create({
      data: {
        amount: totalAmount,
        method: 'TRANSFERENCIA',
        receiptFileId: fileId,
      },
    })

    // Crear ReceiptFile para vincular archivo con recibos
    for (const receipt of receipts) {
      await tx.receiptFile.create({
        data: {
          receiptId: receipt.id,
          fileId: fileId,
          fileType: 'transfer_receipt',
        },
      })

      // Actualizar recibo a estado "en trámite"
      await tx.receipt.update({
        where: { id: receipt.id },
        data: {
          status: ReceiptStatus.UNDER_REVIEW,
          paidAmount: 0, // Aún no confirmado
        },
      })
    }

    return { payment, receiptCount: receipts.length }
  })

  return {
    success: true,
    paymentId: result.payment.id,
    receiptsPaid: result.receiptCount,
    message: 'Pago registrado correctamente. Pendiente de validación.',
  }
})