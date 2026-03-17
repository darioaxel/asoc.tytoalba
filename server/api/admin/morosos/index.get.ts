import { ReceiptStatus, Role } from '../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  // Verificar autenticación y rol de admin
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }
  
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.ROOT) {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }

  try {
    // Obtener fecha actual
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    // Fecha de inicio del mes actual
    const startOfMonth = new Date(currentYear, currentMonth, 1)
    // Fecha de fin del mes actual
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

    // Buscar todos los recibos pendientes o devueltos del mes en curso
    const pendingReceipts = await prisma.receipt.findMany({
      where: {
        status: {
          in: [ReceiptStatus.PENDING, ReceiptStatus.RETURNED]
        },
        dueDate: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        deletedAt: null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            memberType: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    // Agrupar por usuario y calcular totales
    const morososMap = new Map()
    
    for (const receipt of pendingReceipts) {
      const userId = receipt.userId
      const user = receipt.user
      
      if (!morososMap.has(userId)) {
        morososMap.set(userId, {
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          memberType: user.memberType,
          receipts: [],
          totalDebt: 0,
          receiptCount: 0
        })
      }
      
      const moroso = morososMap.get(userId)
      
      // Calcular deuda de este recibo (total - pagado)
      const receiptDebt = Number(receipt.totalAmount) - Number(receipt.paidAmount)
      
      moroso.receipts.push({
        id: receipt.id,
        number: receipt.number,
        concept: receipt.concept,
        dueDate: receipt.dueDate,
        totalAmount: Number(receipt.totalAmount),
        paidAmount: Number(receipt.paidAmount),
        debt: receiptDebt,
        status: receipt.status
      })
      
      moroso.totalDebt += receiptDebt
      moroso.receiptCount += 1
    }

    // Convertir a array y ordenar por deuda (mayor primero)
    const morososList = Array.from(morososMap.values())
      .sort((a, b) => b.totalDebt - a.totalDebt)

    // Calcular totales generales
    const totalGeneral = morososList.reduce((sum, m) => sum + m.totalDebt, 0)
    const totalSocios = morososList.length
    const totalRecibos = morososList.reduce((sum, m) => sum + m.receiptCount, 0)

    return {
      success: true,
      data: {
        month: currentMonth + 1,
        year: currentYear,
        monthName: now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        morosos: morososList,
        summary: {
          totalSocios,
          totalRecibos,
          totalDebt: Math.round(totalGeneral * 100) / 100
        }
      }
    }

  } catch (error) {
    console.error('❌ Error obteniendo lista de morosos:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al obtener la lista de morosos' 
    })
  }
})
