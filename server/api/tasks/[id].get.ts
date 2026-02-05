export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
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
        select: { id: true, firstName: true, lastName: true, email: true, role: true }
      },
      documents: true
    }
  })

  if (!task) {
    throw createError({ statusCode: 404, message: 'Tarea no encontrada' })
  }

  return task
})