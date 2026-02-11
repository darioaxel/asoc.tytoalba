export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID de tarea requerido' })
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
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
        documents: {
          select: { id: true, originalName: true, url: true }
        }
      }
    })

    if (!task) {
      throw createError({ statusCode: 404, message: 'Tarea no encontrada' })
    }

    // Verificar que el usuario está asignado a esta tarea o es admin
    const isAssigned = task.assignees.some(a => a.userId === session.user!.id)
    const isCreator = task.creatorId === session.user!.id
    const isAdmin = session.user!.role === 'ADMIN' || session.user!.role === 'ROOT'
    
    if (!isAssigned && !isCreator && !isAdmin) {
      throw createError({ 
        statusCode: 403, 
        message: 'No tienes acceso a esta tarea' 
      })
    }

    return task
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Error fetching task:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al cargar la tarea' 
    })
  }
})
