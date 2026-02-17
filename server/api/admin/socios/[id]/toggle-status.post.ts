// ~/server/api/admin/socios/[id]/toggle-status.post.ts
// Activa o desactiva un usuario (cambia el estado isActive)

import { Role } from '../../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  // Verificar autenticación
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  // Solo ADMIN o ROOT pueden cambiar el estado de usuarios
  if (!['ADMIN', 'ROOT'].includes(session.user.role || '')) {
    throw createError({
      statusCode: 403,
      message: 'No tienes permisos para realizar esta acción'
    })
  }

  // Obtener ID del usuario de los parámetros
  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'ID de usuario no proporcionado'
    })
  }

  try {
    // Verificar que el usuario existe
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isActive: true,
        role: true,
        firstName: true,
        lastName: true
      }
    })

    if (!targetUser) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado'
      })
    }

    // No permitir desactivar al último ROOT
    if (targetUser.role === Role.ROOT && targetUser.isActive) {
      const rootCount = await prisma.user.count({
        where: { role: Role.ROOT, isActive: true }
      })
      if (rootCount <= 1) {
        throw createError({
          statusCode: 403,
          message: 'No se puede desactivar al único usuario ROOT del sistema'
        })
      }
    }

    // No permitir que un ADMIN desactive a un ROOT
    if (targetUser.role === Role.ROOT && session.user.role !== Role.ROOT) {
      throw createError({
        statusCode: 403,
        message: 'Solo un usuario ROOT puede modificar a otro ROOT'
      })
    }

    // Toggle del estado
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: !targetUser.isActive,
        deactivatedAt: targetUser.isActive ? new Date() : null
      },
      select: {
        id: true,
        isActive: true,
        firstName: true,
        lastName: true
      }
    })

    console.log(`✅ Usuario ${updatedUser.firstName} ${updatedUser.lastName} (${userId}) ${updatedUser.isActive ? 'activado' : 'desactivado'} por ${session.user.email}`)

    return {
      success: true,
      user: updatedUser,
      message: `Usuario ${updatedUser.isActive ? 'activado' : 'desactivado'} correctamente`
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('❌ Error al cambiar estado del usuario:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al cambiar el estado del usuario'
    })
  }
})
