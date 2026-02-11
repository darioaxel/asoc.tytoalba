// ~/server/api/tasks/[id].delete.ts
// Elimina una tarea y sus relaciones asociadas

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  // Verificar autenticación
  if (!session.user?.id) {
    throw createError({ 
      statusCode: 401, 
      message: 'No autenticado' 
    })
  }

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ 
      statusCode: 400, 
      message: 'ID de tarea requerido' 
    })
  }

  try {
    // Verificar que la tarea existe y obtener datos de permisos
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
        documents: {
          select: { id: true, url: true }
        }
      }
    })

    if (!task) {
      throw createError({ 
        statusCode: 404, 
        message: 'Tarea no encontrada' 
      })
    }

    // Verificar permisos: solo el creador, ADMIN o ROOT pueden eliminar
    const isCreator = task.creatorId === session.user.id
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'ROOT'
    
    if (!isCreator && !isAdmin) {
      throw createError({ 
        statusCode: 403, 
        message: 'No tienes permisos para eliminar esta tarea' 
      })
    }

    // Eliminar archivos físicos si existen (opcional, según necesidades)
    // for (const doc of task.documents) {
    //   await deleteFileFromStorage(doc.url)
    // }

    // Eliminar la tarea (las relaciones se eliminan por onDelete: Cascade)
    await prisma.task.delete({
      where: { id }
    })

    console.log(`🗑️ Tarea ${id} eliminada por ${session.user.email}`)

    return {
      success: true,
      message: 'Tarea eliminada correctamente'
    }

  } catch (error: any) {
    console.error('❌ Error eliminando tarea:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      message: 'Error al eliminar la tarea' 
    })
  }
})
