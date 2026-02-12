// ~/server/api/posts/latest.get.ts

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 5

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      tags: {
        select: {
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
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  // Transformar posts para mantener compatibilidad
  const transformedPosts = posts.map(post => ({
    ...post,
    cover: post.coverImage?.path,
  }))

  return { posts: transformedPosts }
})
