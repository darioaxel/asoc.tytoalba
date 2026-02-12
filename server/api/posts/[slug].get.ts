// server/api/posts/[slug].get.ts

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug requerido',
    })
  }

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
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

  // Transformar para mantener compatibilidad
  return {
    ...post,
    cover: post.coverImage?.path,
  }
})
