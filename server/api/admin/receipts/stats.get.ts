// ~/server/api/admin/receipts/stats.get.ts
// Estadísticas de recibos para el panel de administración

import { ReceiptStatus } from '../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  // Verificar autenticación y rol
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  if (!['ADMIN', 'ROOT'].includes(session.user.role || '')) {
    throw createError({ 
      statusCode: 403, 
      message: 'No tienes permisos para acceder a esta función' 
    })
  }

  const { year = new Date().getFullYear().toString() } = getQuery(event)
  const fiscalYear = parseInt(year as string)

  try {
    // Estadísticas por estado
    const [pendingStats, underReviewStats, paidStats, returnedStats, totalByMonth] = await Promise.all([
      // Pendientes
      prisma.receipt.aggregate({
        where: {
          status: ReceiptStatus.PENDING,
          fiscalYear,
          deletedAt: null,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      // En trámite
      prisma.receipt.aggregate({
        where: {
          status: ReceiptStatus.UNDER_REVIEW,
          fiscalYear,
          deletedAt: null,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      // Pagados
      prisma.receipt.aggregate({
        where: {
          status: ReceiptStatus.FULLY_PAID,
          fiscalYear,
          deletedAt: null,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      // Devueltos
      prisma.receipt.aggregate({
        where: {
          status: ReceiptStatus.RETURNED,
          fiscalYear,
          deletedAt: null,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      // Totales por mes (solo pagados)
      prisma.receipt.groupBy({
        by: ['fiscalYear', 'issueDate'],
        where: {
          status: ReceiptStatus.FULLY_PAID,
          fiscalYear,
          deletedAt: null,
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
    ])

    // Contar socios activos con recibos
    const activeUsers = await prisma.receipt.groupBy({
      by: ['userId'],
      where: {
        fiscalYear,
        deletedAt: null,
      },
      _count: { id: true },
    })

    // Calcular totales
    const totalPending = pendingStats._sum.totalAmount ?? 0
    const totalUnderReview = underReviewStats._sum.totalAmount ?? 0
    const totalPaid = paidStats._sum.totalAmount ?? 0
    const totalReturned = returnedStats._sum.totalAmount ?? 0

    return {
      fiscalYear,
      summary: {
        totalReceipts: pendingStats._count.id + underReviewStats._count.id + 
                       paidStats._count.id + returnedStats._count.id,
        totalAmount: totalPending + totalUnderReview + totalPaid + totalReturned,
        activeUsers: activeUsers.length,
      },
      byStatus: {
        pending: {
          count: pendingStats._count.id,
          amount: totalPending,
        },
        underReview: {
          count: underReviewStats._count.id,
          amount: totalUnderReview,
        },
        paid: {
          count: paidStats._count.id,
          amount: totalPaid,
        },
        returned: {
          count: returnedStats._count.id,
          amount: totalReturned,
        },
      },
      collectionRate: totalPaid + totalUnderReview > 0 
        ? Number(((totalPaid / (totalPaid + totalPending + totalUnderReview)) * 100).toFixed(2))
        : 0,
    }

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al cargar las estadísticas' 
    })
  }
})
