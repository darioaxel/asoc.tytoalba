// ~/server/api/admin/receipts/validate.post.ts
// Valida un pago por transferencia (pasa de UNDER_REVIEW a FULLY_PAID)

import { ReceiptStatus, TaskStatus } from '../../../../prisma/generated/client'
import { z } from 'zod'

const validateSchema = z.object({
  receiptId: z.string().uuid('ID de recibo inválido'),
  notes: z.string().max(500, 'Notas demasiado largas').optional(),
})

export default defineEventHandler(async (event) => {
  // Verificar autenticación y rol
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  if (!['ADMIN', 'ROOT'].includes(session.user.role || '')) {
    throw createError({ 
      statusCode: 403, 
      message: 'No tienes permisos para validar pagos' 
    })
  }

  // Validar body
  const body = await readValidatedBody(event, validateSchema.parse)

  try {
    // Buscar el recibo con sus pagos y tarea asociada
    const receipt = await prisma.receipt.findUnique({
      where: { id: body.receiptId },
      include: {
        payments: true,
        task: true, // Incluir tarea de validación
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

    if (!receipt) {
      throw createError({ statusCode: 404, message: 'Recibo no encontrado' })
    }

    if (receipt.status !== ReceiptStatus.UNDER_REVIEW) {
      throw createError({ 
        statusCode: 400, 
        message: 'El recibo no está en estado "en trámite"' 
      })
    }

    // Ejecutar validación en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar recibo a pagado
      const updatedReceipt = await tx.receipt.update({
        where: { id: body.receiptId },
        data: {
          status: ReceiptStatus.FULLY_PAID,
          paidAmount: receipt.totalAmount,
          paymentDate: new Date(),
          validatedAt: new Date(),
          validatedById: session.user!.id,
        }
      })

      // Actualizar el pago asociado (marcar quién lo validó)
      const payment = receipt.payments[0]
      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: { 
            registeredById: session.user!.id,
            // Agregar referencia si hay notas
            reference: body.notes 
              ? `${payment.reference || ''} | Notas admin: ${body.notes}`.trim()
              : payment.reference
          }
        })
      }

      // Crear entrada contable automática
      await tx.accountingEntry.create({
        data: {
          fiscalYear: receipt.fiscalYear,
          month: new Date().getMonth() + 1,
          entryType: 'INCOME',
          category: 'INCOME_FEES',
          concept: `Pago validado - ${receipt.number}`,
          amount: receipt.totalAmount,
          currency: 'EUR',
          reference: receipt.number,
          userId: receipt.userId,
          receiptId: receipt.id,
        }
      })

      // Si existe una tarea de validación asociada, marcarla como resuelta
      if (receipt.task) {
        await tx.task.update({
          where: { id: receipt.task.id },
          data: {
            status: TaskStatus.RESUELTA,
            resolvedAt: new Date(),
            validatorId: session.user!.id,
            longDesc: receipt.task.longDesc + `\n\n✅ VALIDADO el ${new Date().toLocaleDateString('es-ES')} por ${session.user!.email}` +
              (body.notes ? `\n📝 Notas: ${body.notes}` : ''),
          }
        })
      }

      return updatedReceipt
    })

    console.log(`✅ Recibo ${receipt.number} validado por ${session.user.email}`)

    return {
      success: true,
      message: 'Pago validado correctamente',
      receipt: {
        id: result.id,
        number: result.number,
        status: result.status,
        validatedAt: result.validatedAt,
      },
      user: receipt.user,
    }

  } catch (error: any) {
    console.error('❌ Error validando pago:', error)
    
    if (error.statusCode) throw error
    
    throw createError({ 
      statusCode: 500, 
      message: 'Error al validar el pago' 
    })
  }
})
