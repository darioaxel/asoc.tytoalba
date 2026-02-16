import { Role } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID de propuesta requerido' })
  }

  try {
    // Verificar que la propuesta existe
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      select: { id: true, creatorId: true }
    })

    if (!proposal) {
      throw createError({ statusCode: 404, message: 'Propuesta no encontrada' })
    }

    // Verificar permisos: solo creador o admin pueden eliminar
    const isCreator = proposal.creatorId === session.user.id
    const isAdmin = session.user.role === Role.ADMIN || session.user.role === Role.ROOT

    if (!isCreator && !isAdmin) {
      throw createError({ 
        statusCode: 403, 
        message: 'No tienes permisos para eliminar esta propuesta' 
      })
    }

    // Eliminar la propuesta (cascada eliminará votos, responsables, documentos e imágenes)
    await prisma.proposal.delete({
      where: { id }
    })

    console.log(`✅ Propuesta ${id} eliminada por ${session.user.email}`)

    return {
      success: true,
      message: 'Propuesta eliminada exitosamente'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Error deleting proposal:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al eliminar la propuesta' 
    })
  }
})
