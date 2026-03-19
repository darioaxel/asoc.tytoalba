import { ReceiptStatus, TaskType, TaskStatus, Role } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  console.log('💰 === INICIO PAY.POST ===')
  
  const session = await getUserSession(event)
  console.log('👤 Session:', session)
  
  if (!session.user?.id) {
    console.log('❌ Usuario no autenticado')
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const body = await readBody(event)
  console.log('📥 Body recibido:', body)
  
  const { receiptIds, fileId } = body
  console.log('📋 receiptIds:', receiptIds)
  console.log('📎 fileId:', fileId)

  if (!receiptIds?.length || !fileId) {
    console.log('❌ Faltan datos:', { receiptIds, fileId })
    throw createError({ 
      statusCode: 400, 
      message: 'Se requieren recibos y justificante de pago' 
    })
  }

  // Verificar que los recibos pertenecen al usuario y están pendientes
  console.log('🔍 Buscando recibos:', receiptIds)
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
  console.log('📄 Recibos encontrados:', receipts.length, receipts.map(r => ({ id: r.id, number: r.number })))

  if (receipts.length !== receiptIds.length) {
    console.log('❌ No se encontraron todos los recibos. Esperados:', receiptIds.length, 'Encontrados:', receipts.length)
    throw createError({ 
      statusCode: 400, 
      message: 'Algunos recibos no son válidos para pago' 
    })
  }

  // Verificar que el archivo existe
  console.log('🔍 Buscando archivo:', fileId)
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  })
  console.log('📎 Archivo encontrado:', file ? 'Sí' : 'No')

  if (!file) {
    console.log('❌ Archivo no encontrado')
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

  // Crear pagos, actualizar recibos y crear tareas de validación en transacción
  const result = await prisma.$transaction(async (tx) => {
    const createdPayments = []
    const createdTasks = []

    // Procesar cada recibo (un pago por recibo)
    for (const receipt of receipts) {
      // 1. Crear ReceiptFile para vincular archivo con recibo
      const receiptFile = await tx.receiptFile.create({
        data: {
          receiptId: receipt.id,
          fileId: fileId,
          fileType: 'transfer_receipt',
        },
      })

      // 2. Crear el pago vinculado al recibo y al ReceiptFile
      const payment = await tx.payment.create({
        data: {
          receiptId: receipt.id, // ← AHORA sí vinculamos con el recibo
          amount: receipt.totalAmount,
          method: 'TRANSFERENCIA',
          receiptFileId: receiptFile.id, // Vinculamos con el ReceiptFile creado
        },
      })
      createdPayments.push(payment)

      // 3. Actualizar recibo a estado "en trámite"
      await tx.receipt.update({
        where: { id: receipt.id },
        data: {
          status: ReceiptStatus.UNDER_REVIEW,
          paidAmount: 0, // Aún no confirmado
        },
      })

      // 4. Crear tarea de validación para los admins
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
      payments: createdPayments,
      receiptCount: receipts.length,
      tasks: createdTasks,
    }
  })

  console.log(`✅ Pagos procesados: ${result.receiptCount} recibo(s), ${result.payments.length} pago(s), ${result.tasks.length} tarea(s) creada(s) para admins`)
  console.log('💰 === FIN PAY.POST ===')

  return {
    success: true,
    paymentCount: result.payments.length,
    receiptsPaid: result.receiptCount,
    tasksCreated: result.tasks.length,
    message: 'Pago registrado correctamente. Pendiente de validación por administración.',
  }
})
