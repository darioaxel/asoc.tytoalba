import { Role } from '../../../prisma/generated/client'
import { z } from 'zod'

const updateTaskSchema = z.object({
  shortDesc: z.string().min(1).max(255).optional(),
  longDesc: z.string().optional().nullable(),
  type: z.enum(['IMPORTANTE', 'URGENTE', 'PROPUESTA']).optional(),
  status: z.enum(['CREADA', 'ASIGNADA', 'EN_CURSO', 'RESUELTA', 'ESPERANDO_VALIDACION']).optional(),
  assigneeIds: z.array(z.string()).optional(),
  validatorId: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  resolvedAt: z.string().datetime().optional().nullable()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const validated = updateTaskSchema.parse(body)

  // Verificar validador si se cambia
  if (validated.validatorId) {
    const validator = await prisma.user.findFirst({
      where: { id: validated.validatorId, role: Role.ADMIN }
    })
    if (!validator) {
      throw createError({ statusCode: 400, message: 'El validador debe ser un administrador' })
    }
  }

  // Construir datos de actualización
  const data: any = { ...validated }
  
  if (validated.startDate) data.startDate = new Date(validated.startDate)
  if (validated.endDate) data.endDate = new Date(validated.endDate)
  if (validated.resolvedAt) data.resolvedAt = new Date(validated.resolvedAt)

  // Si se proporcionan assigneeIds, actualizar relaciones
  if (validated.assigneeIds) {
    // Primero eliminar asignaciones existentes
    await prisma.taskAssignee.deleteMany({ where: { taskId: id } })
    
    // Crear nuevas
    await prisma.taskAssignee.createMany({
      data: validated.assigneeIds.map(userId => ({
        taskId: id!,
        userId,
        assignedAt: new Date()
      }))
    })
    
    delete data.assigneeIds // No pasar al update directo
  }

  const task = await prisma.task.update({
    where: { id },
    data,
    include: {
      creator: true,
      assignees: { include: { user: true } },
      validator: true
    }
  })

  return task
})