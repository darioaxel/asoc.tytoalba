// ~/server/api/posts/latest.get.ts

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 5

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      cover: true,
      publishedAt: true,
      author: {               // <-- relación autor
        select: {
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      tags: {                 // opcional, si también quieres los tags
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return { posts }
})