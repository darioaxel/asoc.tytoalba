import { TaskStatus } from '../../../prisma/generated/client'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['CREADA', 'ASIGNADA', 'EN_CURSO', 'RESUELTA', 'ESPERANDO_VALIDACION']).optional(),
  shortDesc: z.string().min(1).max(255).optional(),
  longDesc: z.string().optional(),
})

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
    // Verificar que la tarea existe
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        assignees: {
          select: { userId: true }
        }
      }
    })

    if (!existingTask) {
      throw createError({ statusCode: 404, message: 'Tarea no encontrada' })
    }

    // Verificar permisos
    const isAssigned = existingTask.assignees.some(a => a.userId === session.user!.id)
    const isCreator = existingTask.creatorId === session.user!.id
    const isAdmin = session.user!.role === 'ADMIN' || session.user!.role === 'ROOT'
    
    if (!isAssigned && !isCreator && !isAdmin) {
      throw createError({ 
        statusCode: 403, 
        message: 'No tienes permisos para actualizar esta tarea' 
      })
    }

    // Validar body
    const body = await readBody(event)
    const validated = updateSchema.parse(body)

    // Preparar datos de actualización
    const updateData: any = {}
    
    if (validated.status) {
      updateData.status = validated.status
      
      // Si cambia a RESUELTA o ESPERANDO_VALIDACION, setear resolvedAt
      if (['RESUELTA', 'ESPERANDO_VALIDACION'].includes(validated.status)) {
        updateData.resolvedAt = new Date()
      }
    }
    
    if (validated.shortDesc !== undefined) {
      updateData.shortDesc = validated.shortDesc
    }
    
    if (validated.longDesc !== undefined) {
      updateData.longDesc = validated.longDesc
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
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

    return task
  } catch (error: any) {
    if (error.statusCode) throw error
    
    if (error.name === 'ZodError') {
      throw createError({ 
        statusCode: 400, 
        message: error.errors[0]?.message || 'Datos inválidos' 
      })
    }
    
    console.error('Error updating task:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al actualizar la tarea' 
    })
  }
})
