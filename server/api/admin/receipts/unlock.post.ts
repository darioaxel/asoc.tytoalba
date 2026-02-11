// ~/server/api/admin/receipts/unlock.post.ts
// Desbloquea recibos para que sean visibles y pagables por los socios

import { z } from 'zod'

const unlockSchema = z.object({
  receiptIds: z.array(z.string().uuid()).min(1, 'Debe proporcionar al menos un recibo'),
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
      message: 'No tienes permisos para desbloquear recibos' 
    })
  }

  // Validar body
  const body = await readValidatedBody(event, unlockSchema.parse)

  try {
    // Desbloquear recibos
    const result = await prisma.receipt.updateMany({
      where: {
        id: { in: body.receiptIds },
        isLocked: true, // Solo los bloqueados
        deletedAt: null,
      },
      data: {
        isLocked: false,
        unlockedAt: new Date(),
        unlockedById: session.user!.id,
      }
    })

    if (result.count === 0) {
      throw createError({ 
        statusCode: 400, 
        message: 'No se encontraron recibos bloqueados para desbloquear' 
      })
    }

    console.log(`🔓 ${result.count} recibos desbloqueados por ${session.user.email}`)

    return {
      success: true,
      message: `${result.count} recibo(s) desbloqueado(s) correctamente`,
      unlockedCount: result.count,
    }

  } catch (error: any) {
    console.error('❌ Error desbloqueando recibos:', error)
    
    if (error.statusCode) throw error
    
    throw createError({ 
      statusCode: 500, 
      message: 'Error al desbloquear los recibos' 
    })
  }
})
