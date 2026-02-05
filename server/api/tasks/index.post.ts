import { Role } from '../../../prisma/generated/client'
import { z } from 'zod'


const createTaskSchema = z.object({
  shortDesc: z.string().min(1).max(255),
  longDesc: z.string().optional(),
  type: z.enum(['IMPORTANTE', 'URGENTE', 'PROPUESTA']),
  status: z.enum(['CREADA', 'ASIGNADA', 'EN_CURSO', 'RESUELTA', 'ESPERANDO_VALIDACION']).default('CREADA'),
  assigneeIds: z.array(z.string()).min(1, 'Debe asignar al menos un socio'),
  validatorId: z.string().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable()
})

export default defineEventHandler(async (event) => {
  // Aquí deberías verificar el auth token y obtener el userId
  const userId = 'USER_ID_FROM_TOKEN' // Implementar según tu auth
  
  const body = await readBody(event)
  const validated = createTaskSchema.parse(body)

  // Verificar que el validador sea ADMIN si se proporciona
  if (validated.validatorId) {
    const validator = await prisma.user.findFirst({
      where: { id: validated.validatorId, role: Role.ADMIN }
    })
    if (!validator) {
      throw createError({ statusCode: 400, message: 'El validador debe ser un administrador' })
    }
  }

  // Verificar que los asignados existan
  const assignees = await prisma.user.findMany({
    where: { id: { in: validated.assigneeIds } }
  })
  
  if (assignees.length !== validated.assigneeIds.length) {
    throw createError({ statusCode: 400, message: 'Algunos asignados no existen' })
  }

  const task = await prisma.task.create({
    data: {
      shortDesc: validated.shortDesc,
      longDesc: validated.longDesc,
      type: validated.type,
      status: validated.status,
      creatorId: userId,
      validatorId: validated.validatorId,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      endDate: validated.endDate ? new Date(validated.endDate) : null,
      assignees: {
        create: validated.assigneeIds.map(id => ({
          userId: id,
          assignedAt: new Date()
        }))
      }
    },
    include: {
      creator: true,
      assignees: { include: { user: true } },
      validator: true
    }
  })

  return task
})