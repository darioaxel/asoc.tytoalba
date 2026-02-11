// ~/server/api/admin/receipts/reject.post.ts
// Rechaza/devuelve un recibo en trámite (pasa de UNDER_REVIEW a RETURNED)

import { ReceiptStatus, TaskStatus } from '../../../../prisma/generated/client'
import { z } from 'zod'

const rejectSchema = z.object({
  receiptId: z.string().uuid('ID de recibo inválido'),
  reason: z.string().min(5, 'El motivo debe tener al menos 5 caracteres').max(500, 'Motivo demasiado largo'),
  unlockForRetry: z.boolean().default(false), // Si true, permite que el socio vuelva a pagar
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
      message: 'No tienes permisos para rechazar pagos' 
    })
  }

  // Validar body
  const body = await readValidatedBody(event, rejectSchema.parse)

  try {
    // Buscar el recibo con tarea asociada
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

    // Ejecutar rechazo en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar recibo a devuelto
      const updatedReceipt = await tx.receipt.update({
        where: { id: body.receiptId },
        data: {
          status: ReceiptStatus.RETURNED,
          returnedAt: new Date(),
          rejectionReason: body.reason,
          // Si se permite reintento, desbloquear el recibo
          isLocked: body.unlockForRetry ? false : receipt.isLocked,
          unlockedAt: body.unlockForRetry ? new Date() : receipt.unlockedAt,
          unlockedById: body.unlockForRetry ? session.user!.id : receipt.unlockedById,
        }
      })

      // Actualizar el pago asociado (marcar como rechazado)
      const payment = receipt.payments[0]
      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: { 
            registeredById: session.user!.id,
            reference: `RECHAZADO: ${body.reason}`
          }
        })
      }

      // Si existe una tarea de validación asociada, actualizarla
      if (receipt.task) {
        await tx.task.update({
          where: { id: receipt.task.id },
          data: {
            status: body.unlockForRetry ? TaskStatus.CREADA : TaskStatus.RESUELTA,
            resolvedAt: body.unlockForRetry ? null : new Date(),
            validatorId: session.user!.id,
            longDesc: receipt.task.longDesc + `\n\n❌ RECHAZADO el ${new Date().toLocaleDateString('es-ES')} por ${session.user!.email}` +
              `\n📋 Motivo: ${body.reason}` +
              (body.unlockForRetry ? '\n🔓 Recibo desbloqueado para nuevo intento' : ''),
          }
        })
      }

      return updatedReceipt
    })

    console.log(`❌ Recibo ${receipt.number} rechazado por ${session.user.email}: ${body.reason}`)

    return {
      success: true,
      message: body.unlockForRetry 
        ? 'Pago rechazado. El recibo ha sido desbloqueado para nuevo intento.'
        : 'Pago rechazado correctamente',
      receipt: {
        id: result.id,
        number: result.number,
        status: result.status,
        returnedAt: result.returnedAt,
        rejectionReason: result.rejectionReason,
        isLocked: result.isLocked,
      },
      user: receipt.user,
      unlockForRetry: body.unlockForRetry,
    }

  } catch (error: any) {
    console.error('❌ Error rechazando pago:', error)
    
    if (error.statusCode) throw error
    
    throw createError({ 
      statusCode: 500, 
      message: 'Error al rechazar el pago' 
    })
  }
})
