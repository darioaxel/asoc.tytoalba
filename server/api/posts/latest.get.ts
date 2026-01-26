// server/api/posts/latest.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })

  return { posts }
})