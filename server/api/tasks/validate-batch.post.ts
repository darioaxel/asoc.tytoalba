// server/api/tasks/validate-batch.post.ts
import { TaskStatus } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { taskIds } = body
  
  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    throw createError({ statusCode: 400, message: 'No tasks provided' })
  }

  // Actualizar todas las tareas seleccionadas a RESUELTA (o el estado que prefieras)
  const result = await prisma.task.updateMany({
    where: {
      id: { in: taskIds },
      status: { not: TaskStatus.RESUELTA } // Opcional: evitar re-validar
    },
    data: {
      status: TaskStatus.RESUELTA,
      resolvedAt: new Date()
    }
  })

  return { 
    message: `${result.count} tareas validadas`,
    count: result.count 
  }
})