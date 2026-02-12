import { unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requerido' })
  }

  // Obtener el post con sus imágenes
  const post = await prisma.post.findFirst({
    where: { 
      id: Number(id),
      authorId: session.user.id
    },
    include: {
      images: {
        include: {
          file: true
        }
      },
      coverImage: true
    }
  })

  if (!post) {
    throw createError({ statusCode: 404, message: 'Post no encontrado' })
  }

  // Recopilar todas las imágenes a eliminar
  const filesToDelete = new Set<string>()
  
  // Imagen de portada
  if (post.coverImage) {
    filesToDelete.add(post.coverImage.id)
  }
  
  // Imágenes del contenido
  post.images.forEach((img: any) => {
    if (img.file) {
      filesToDelete.add(img.file.id)
    }
  })

  // Eliminar archivos de disco
  for (const fileId of filesToDelete) {
    const file = await prisma.file.findUnique({ where: { id: fileId } })
    if (file) {
      try {
        const filePath = join(process.cwd(), file.path)
        await unlink(filePath)
        console.log(`🗑️ Archivo eliminado: ${file.path}`)
      } catch (error) {
        console.warn(`⚠️ No se pudo eliminar archivo ${file.path}:`, error)
      }
    }
  }

  // Eliminar el post (esto elimina las relaciones PostImage en cascada)
  await prisma.post.delete({
    where: { id: Number(id) }
  })

  // Eliminar registros de File huérfanos
  for (const fileId of filesToDelete) {
    try {
      await prisma.file.delete({ where: { id: fileId } })
    } catch (error) {
      // Puede que ya se haya eliminado por cascada
    }
  }

  return { 
    success: true, 
    message: 'Post eliminado',
    deletedFiles: filesToDelete.size
  }
})
