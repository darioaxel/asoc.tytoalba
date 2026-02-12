export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requerido' })
  }

  const post = await prisma.post.findFirst({
    where: { 
      id: Number(id),
      authorId: session.user.id // Solo el autor puede ver/editar
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      coverImage: {
        select: {
          id: true,
          path: true,
        }
      }
    },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post no encontrado',
    })
  }

  // Transformar para mantener compatibilidad con el frontend
  return {
    ...post,
    cover: post.coverImage?.path,
  }
})
