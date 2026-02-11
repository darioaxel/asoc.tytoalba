import { TaskStatus, TaskType } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 10))
  const skip = (page - 1) * limit
  
  const status = query.status as string | undefined
  const type = query.type as string | undefined
  const search = query.search as string | undefined
  const mine = query.mine === 'true' // Solo tareas asignadas al usuario

  try {
    // Construir where clause
    const where: any = {}
    
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      where.status = status
    }
    
    if (type && Object.values(TaskType).includes(type as TaskType)) {
      where.type = type
    }
    
    if (search) {
      where.shortDesc = { contains: search, mode: 'insensitive' }
    }
    
    // Si se solicitan solo las tareas del usuario
    if (mine) {
      where.assignees = {
        some: {
          userId: session.user.id
        }
      }
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
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true }
              }
            }
          },
          validator: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          _count: {
            select: { documents: true }
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
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al cargar las tareas' 
    })
  }
})
