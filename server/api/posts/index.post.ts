import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  slug: z.string().min(1, 'El slug es obligatorio').max(200, 'Máximo 200 caracteres'),
  excerpt: z.string().max(500, 'Máximo 500 caracteres').optional(),
  coverImageId: z.string().uuid().optional(), // Ahora es UUID de File, no URL string
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  published: z.boolean().default(false),
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

  try {
    const body = await readBody(event)
    const validated = createPostSchema.parse(body)

    // Verificar que el slug no exista ya
    const existingPost = await prisma.post.findUnique({
      where: { slug: validated.slug }
    })

    if (existingPost) {
      throw createError({
        statusCode: 400,
        message: 'Ya existe un post con esta URL (slug). Por favor, elige otro título o modifica el slug.'
      })
    }

    // Verificar que el coverImage existe si se proporcionó
    if (validated.coverImageId) {
      const file = await prisma.file.findUnique({
        where: { id: validated.coverImageId }
      })
      if (!file) {
        throw createError({
          statusCode: 400,
          message: 'La imagen de portada no existe'
        })
      }
    }

    // Generar excerpt si no se proporcionó
    let excerpt = validated.excerpt
    if (!excerpt && validated.content) {
      const plainText = validated.content
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      excerpt = plainText.length > 200 
        ? plainText.substring(0, 197) + '...' 
        : plainText
    }

    // Procesar tags si se proporcionaron
    const tagConnections = []
    if (validated.tags && validated.tags.length > 0) {
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
    }

    // Crear el post
    const post = await prisma.post.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: excerpt || '',
        content: validated.content || '',
        coverImageId: validated.coverImageId,
        published: validated.published,
        publishedAt: validated.published ? new Date() : null,
        authorId: session.user.id,
        ...(tagConnections.length > 0 && {
          tags: {
            connect: tagConnections,
          },
        }),
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

    console.log(`✅ Post "${post.title}" creado por ${session.user.email} (published: ${validated.published})`)

    return {
      success: true,
      message: validated.published 
        ? 'Post publicado exitosamente' 
        : 'Borrador guardado exitosamente',
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        cover: post.coverImage?.path,
        published: post.published,
        publishedAt: post.publishedAt,
        author: post.author,
        tags: post.tags,
      }
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    if (error.name === 'ZodError') {
      throw createError({ 
        statusCode: 400, 
        message: error.errors[0]?.message || 'Datos inválidos' 
      })
    }
    
    console.error('❌ Error creando post:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al crear el post' 
    })
  }
})
