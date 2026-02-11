import { ReceiptStatus, TaskType, TaskStatus, Role } from '../../../prisma/generated/client'

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
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      }
    }
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

  // Buscar administradores para asignar la tarea
  const admins = await prisma.user.findMany({
    where: {
      role: { in: [Role.ADMIN, Role.ROOT] },
      isActive: true,
    },
    select: { id: true },
  })

  // Crear pago, actualizar recibos y crear tareas de validación en transacción
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

    const createdTasks = []

    // Procesar cada recibo
    for (const receipt of receipts) {
      // Crear ReceiptFile para vincular archivo con recibo
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

      // Crear tarea de validación para los admins
      const userName = receipt.user.firstName && receipt.user.lastName
        ? `${receipt.user.firstName} ${receipt.user.lastName}`
        : receipt.user.email

      const task = await tx.task.create({
        data: {
          shortDesc: `Validar pago - Recibo ${receipt.number}`,
          longDesc: `El socio ${userName} (${receipt.user.email}) ha realizado un pago por transferencia.\n\n` +
            `📋 Recibo: ${receipt.number}\n` +
            `💰 Importe: ${receipt.totalAmount}€\n` +
            `📝 Concepto: ${receipt.concept}\n` +
            `📎 Justificante: ${file.name}\n\n` +
            `Por favor, verifica que la transferencia se ha recibido correctamente y valida el pago.`,
          type: TaskType.URGENTE,
          status: TaskStatus.CREADA,
          receiptId: receipt.id, // Vincular con el recibo
          creatorId: session.user.id, // El socio que pagó es el creador
          // Asignar a todos los admins
          assignees: {
            create: admins.map(admin => ({
              userId: admin.id,
              assignedAt: new Date(),
            })),
          },
          startDate: new Date(),
        },
      })

      createdTasks.push({
        id: task.id,
        receiptNumber: receipt.number,
      })
    }

    return { 
      payment, 
      receiptCount: receipts.length,
      tasks: createdTasks,
    }
  })

  console.log(`✅ Pago procesado: ${result.receiptCount} recibo(s), ${result.tasks.length} tarea(s) creada(s) para admins`)

  return {
    success: true,
    paymentId: result.payment.id,
    receiptsPaid: result.receiptCount,
    tasksCreated: result.tasks.length,
    message: 'Pago registrado correctamente. Pendiente de validación por administración.',
  }
})
