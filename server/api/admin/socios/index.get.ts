// ~/server/api/admin/socios/index.get.ts
// Lista todos los socios con información de deuda y tipo de membresía

import { Role, ReceiptStatus } from '../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  // Verificar autenticación
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  // Solo ADMIN o ROOT pueden acceder a la lista de socios
  if (!['ADMIN', 'ROOT'].includes(session.user.role || '')) {
    throw createError({
      statusCode: 403,
      message: 'No tienes permisos para acceder a esta función'
    })
  }

  const { search = '' } = getQuery(event)

  try {
    // Construir where clause
    const where: any = {
      role: { in: [Role.USER, Role.ADMIN, Role.ROOT] }
    }

    // Búsqueda por nombre, apellidos, email o DNI
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { dni: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    // Obtener usuarios con sus relaciones
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dni: true,
        email: true,
        isActive: true,
        role: true,
        createdAt: true,
        memberType: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        paymentData: {
          select: {
            paymentMethod: true,
            iban: true
          }
        },
        receipts: {
          where: {
            deletedAt: null,
            status: {
              in: [ReceiptStatus.PENDING, ReceiptStatus.PARTIALLY_PAID, ReceiptStatus.IN_PROCESS]
            }
          },
          select: {
            totalAmount: true,
            paidAmount: true
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })

    // Calcular deuda total y formatear respuesta
    const socios = users.map(user => {
      // Calcular deuda total (suma de totalAmount - paidAmount de recibos pendientes)
      const deudaTotal = user.receipts.reduce((sum, receipt) => {
        const pendingAmount = Number(receipt.totalAmount) - Number(receipt.paidAmount)
        return sum + pendingAmount
      }, 0)

      return {
        id: user.id,
        nombre: user.firstName,
        apellidos: user.lastName,
        dni: user.dni,
        email: user.email,
        tipoSocio: user.memberType?.name || 'Sin tipo',
        tipoSocioCode: user.memberType?.type || null,
        metodoPago: user.paymentData?.paymentMethod || 'TRANSFERENCIA',
        tieneIban: !!user.paymentData?.iban,
        fechaAlta: user.createdAt,
        activo: user.isActive,
        rol: user.role,
        deudaTotal
      }
    })

    return socios

  } catch (error) {
    console.error('❌ Error al obtener lista de socios:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al cargar la lista de socios'
    })
  }
})
