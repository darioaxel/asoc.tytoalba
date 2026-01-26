// server/api/posts/[slug].get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      cover: true,
      publishedAt: true,
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
    },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post no encontrado',
    })
  }

  return post
})