import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().max(500).optional().nullable(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
})

// Generar slug a partir de un string
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requerido' })
  }

  try {
    const body = await readBody(event)
    const validated = updatePostSchema.parse(body)

    // Verificar que el post existe y pertenece al usuario
    const existingPost = await prisma.post.findFirst({
      where: { 
        id: Number(id),
        authorId: session.user.id
      }
    })

    if (!existingPost) {
      throw createError({ 
        statusCode: 404, 
        message: 'Post no encontrado o no tienes permiso para editarlo' 
      })
    }

    // Si se cambia el slug, verificar que no exista otro
    if (validated.slug && validated.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validated.slug }
      })
      if (slugExists) {
        throw createError({
          statusCode: 400,
          message: 'Ya existe un post con esta URL (slug)'
        })
      }
    }

    // Procesar tags si se proporcionaron
    let tagData = undefined
    if (validated.tags) {
      const tagConnections = []
      for (const tagName of validated.tags) {
        const tagSlug = generateSlug(tagName)
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
            slug: tagSlug,
          },
        })
        tagConnections.push({ id: tag.id })
      }
      tagData = { set: [], connect: tagConnections }
    }

    // Preparar datos de actualización
    const updateData: any = {
      ...(validated.title && { title: validated.title }),
      ...(validated.slug && { slug: validated.slug }),
      ...(validated.excerpt !== undefined && { excerpt: validated.excerpt }),
      ...(validated.coverImage !== undefined && { cover: validated.coverImage }),
      ...(validated.content !== undefined && { content: validated.content }),
      ...(validated.published !== undefined && { 
        published: validated.published,
        publishedAt: validated.published ? new Date() : null 
      }),
      ...(tagData && { tags: tagData }),
    }

    // Actualizar el post
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: updateData,
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
      },
    })

    console.log(`✅ Post "${post.title}" actualizado por ${session.user.email}`)

    return {
      success: true,
      message: validated.published 
        ? 'Post publicado exitosamente' 
        : 'Borrador guardado exitosamente',
      post
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    if (error.name === 'ZodError') {
      throw createError({ 
        statusCode: 400, 
        message: error.errors[0]?.message || 'Datos inválidos' 
      })
    }
    
    console.error('❌ Error actualizando post:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al actualizar el post' 
    })
  }
})
