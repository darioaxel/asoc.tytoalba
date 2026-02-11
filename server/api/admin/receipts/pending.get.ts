// ~/server/api/admin/receipts/pending.get.ts
// Lista todos los recibos pendientes de validación (UNDER_REVIEW)

import { ReceiptStatus } from '../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  // Verificar autenticación y rol de admin
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  // Solo ADMIN o ROOT pueden validar pagos
  if (!['ADMIN', 'ROOT'].includes(session.user.role || '')) {
    throw createError({ 
      statusCode: 403, 
      message: 'No tienes permisos para acceder a esta función' 
    })
  }

  const { page = '1', limit = '20', search = '' } = getQuery(event)
  const pageNum = Math.max(1, parseInt(page as string))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)))
  const skip = (pageNum - 1) * limitNum

  try {
    // Construir where clause
    const where: any = {
      status: ReceiptStatus.UNDER_REVIEW,
      deletedAt: null,
    }

    // Búsqueda por nombre, email o número de recibo
    if (search) {
      where.OR = [
        { number: { contains: search as string, mode: 'insensitive' } },
        { 
          user: {
            OR: [
              { firstName: { contains: search as string, mode: 'insensitive' } },
              { lastName: { contains: search as string, mode: 'insensitive' } },
              { email: { contains: search as string, mode: 'insensitive' } },
            ]
          }
        }
      ]
    }

    // Obtener recibos con paginación
    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        orderBy: { issueDate: 'asc' },
        skip,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            }
          },
          payments: {
            include: {
              receiptFile: {
                include: {
                  file: {
                    select: {
                      id: true,
                      name: true,
                      path: true,
                      mime: true,
                      size: true,
                    }
                  }
                }
              }
            }
          },
          receiptFiles: {
            include: {
              file: {
                select: {
                  id: true,
                  name: true,
                  path: true,
                  mime: true,
                }
              }
            }
          }
        }
      }),
      prisma.receipt.count({ where })
    ])

    // Calcular estadísticas
    const stats = await prisma.receipt.aggregate({
      where: {
        status: ReceiptStatus.UNDER_REVIEW,
        deletedAt: null,
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    })

    return {
      receipts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      stats: {
        count: stats._count.id,
        totalAmount: stats._sum.totalAmount ?? 0,
      }
    }

  } catch (error) {
    console.error('❌ Error al obtener recibos pendientes:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al cargar los recibos pendientes' 
    })
  }
})
