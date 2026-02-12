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

  const body = await readBody(event)
  const { fileId } = body

  if (!fileId) {
    throw createError({ statusCode: 400, message: 'fileId requerido' })
  }

  // Verificar que el post existe y pertenece al usuario
  const post = await prisma.post.findFirst({
    where: { 
      id: Number(id),
      authorId: session.user.id
    }
  })

  if (!post) {
    throw createError({ statusCode: 404, message: 'Post no encontrado' })
  }

  // Obtener el archivo
  const file = await prisma.file.findUnique({
    where: { id: fileId }
  })

  if (!file) {
    throw createError({ statusCode: 404, message: 'Archivo no encontrado' })
  }

  // Verificar que la imagen pertenece a este post
  const postImage = await prisma.postImage.findFirst({
    where: { postId: Number(id), fileId }
  })

  const isCoverImage = post.coverImageId === fileId

  if (!postImage && !isCoverImage) {
    throw createError({ statusCode: 403, message: 'La imagen no pertenece a este post' })
  }

  try {
    // Eliminar archivo de disco
    const filePath = join(process.cwd(), file.path)
    await unlink(filePath)
  } catch (error) {
    console.warn('No se pudo eliminar archivo de disco:', error)
    // Continuamos aunque falle (puede que ya no exista)
  }

  // Eliminar relación PostImage si existe
  if (postImage) {
    await prisma.postImage.delete({
      where: { id: postImage.id }
    })
  }

  // Si es la imagen de portada, limpiar referencia
  if (isCoverImage) {
    await prisma.post.update({
      where: { id: Number(id) },
      data: { coverImageId: null }
    })
  }

  // Eliminar registro de File
  await prisma.file.delete({
    where: { id: fileId }
  })

  return { success: true, message: 'Imagen eliminada' }
})
