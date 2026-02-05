import { Role } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = 5 // Fijo a 5 como pediste
  const skip = (page - 1) * limit
  
  const status = query.status as string | undefined
  const type = query.type as string | undefined
  const search = query.search as string | undefined

  const where: any = {}

  if (status && Object.values(['CREADA', 'ASIGNADA', 'EN_CURSO', 'RESUELTA', 'ESPERANDO_VALIDACION']).includes(status)) {
    where.status = status
  }
  
  if (type && Object.values(['IMPORTANTE', 'URGENTE', 'PROPUESTA']).includes(type)) {
    where.type = type
  }
  
  if (search) {
    where.shortDesc = { contains: search, mode: 'insensitive' }
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        assignees: {
          take: 1, // Solo el primero para la tabla
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        },
        _count: {
          select: { assignees: true, documents: true }
        }
      }
    }),
    prisma.task.count({ where })
  ])

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  }
})