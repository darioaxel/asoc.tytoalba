import { TaskStatus, TaskType, Role } from '../../../prisma/generated/client'
import { z } from 'zod'

const createTaskSchema = z.object({
  shortDesc: z.string().min(1, 'El título es obligatorio').max(255, 'Máximo 255 caracteres'),
  longDesc: z.string().optional(),
  type: z.enum(['IMPORTANTE', 'URGENTE', 'PROPUESTA']),
  assigneeIds: z.array(z.string().uuid()).min(1, 'Debe asignar al menos un socio'),
  documentIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  try {
    const body = await readBody(event)
    const validated = createTaskSchema.parse(body)

    // Verificar que los documentos existen si se proporcionan
    let fileDocuments: any[] = []
    if (validated.documentIds && validated.documentIds.length > 0) {
      const files = await prisma.file.findMany({
        where: { id: { in: validated.documentIds } }
      })
      if (files.length !== validated.documentIds.length) {
        throw createError({ 
          statusCode: 400, 
          message: 'Algunos documentos no existen' 
        })
      }
      // Preparar datos de documentos
      fileDocuments = files.map(file => ({
        filename: file.name,
        originalName: file.name,
        mimeType: file.mime,
        size: file.size,
        url: file.path,
      }))
    }

    // Verificar que los asignados existen
    const assignees = await prisma.user.findMany({
      where: { 
        id: { in: validated.assigneeIds },
        isActive: true 
      }
    })
    
    if (assignees.length !== validated.assigneeIds.length) {
      throw createError({ 
        statusCode: 400, 
        message: 'Algunos asignados no existen o están inactivos' 
      })
    }

    // Crear la tarea
    const task = await prisma.task.create({
      data: {
        shortDesc: validated.shortDesc,
        longDesc: validated.longDesc,
        type: validated.type as TaskType,
        status: TaskStatus.CREADA,
        creatorId: session.user.id,
        // validatorId se asignará cuando un admin valide la tarea
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        assignees: {
          create: validated.assigneeIds.map(userId => ({
            userId,
            assignedAt: new Date()
          }))
        },
        documents: fileDocuments.length > 0 ? {
          create: fileDocuments
        } : undefined
      },
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
        }
      }
    })

    console.log(`✅ Tarea ${task.id} creada por ${session.user.email}`)

    return {
      success: true,
      message: 'Tarea creada exitosamente',
      task
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    if (error.name === 'ZodError') {
      throw createError({ 
        statusCode: 400, 
        message: error.errors[0]?.message || 'Datos inválidos' 
      })
    }
    
    console.error('❌ Error creando tarea:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al crear la tarea' 
    })
  }
})
