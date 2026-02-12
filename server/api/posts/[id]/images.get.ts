export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requerido' })
  }

  // Verificar que el post existe y pertenece al usuario
  const post = await prisma.post.findFirst({
    where: { 
      id: Number(id),
      authorId: session.user.id
    }
  })

  if (!post) {
    throw createError({ 
      statusCode: 404, 
      message: 'Post no encontrado' 
    })
  }

  // Obtener imágenes relacionadas con el post
  const images = await prisma.postImage.findMany({
    where: { postId: Number(id) },
    include: {
      file: {
        select: {
          id: true,
          name: true,
          path: true,
          mime: true,
          size: true,
          createdAt: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return images
})
