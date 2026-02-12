import { writeFile } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, message: 'No se recibió archivo' })
  }

  const file = formData.find(f => f.name === 'file')
  if (!file) {
    throw createError({ statusCode: 400, message: 'Archivo no encontrado' })
  }

  // Detectar tipo de upload (receipts o blog)
  const typeField = formData.find(f => f.name === 'type')
  const uploadType = typeField?.data?.toString() || 'receipt'
  
  // Configurar según tipo
  const isBlogImage = uploadType === 'blog'
  const allowedTypes = isBlogImage 
    ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    : ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  const maxSize = isBlogImage ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB para blog, 5MB para recibos
  const uploadDirName = isBlogImage ? 'blog' : 'receipts'

  // Validar tipo
  if (!allowedTypes.includes(file.type || '')) {
    throw createError({ 
      statusCode: 400, 
      message: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}` 
    })
  }

  // Validar tamaño
  if (file.data.length > maxSize) {
    throw createError({ 
      statusCode: 400, 
      message: `Archivo demasiado grande (máx ${maxSize / 1024 / 1024}MB)` 
    })
  }

  // Generar nombre único
  const hash = crypto.createHash('md5').update(file.data).digest('hex')
  const ext = file.filename?.split('.').pop() || 'bin'
  const fileName = `${Date.now()}-${hash.slice(0, 8)}.${ext}`
  const uploadDir = join(process.cwd(), 'uploads', uploadDirName)
  const filePath = join(uploadDir, fileName)

  // Guardar archivo
  await writeFile(filePath, file.data)

  // Crear registro en BD
  const fileRecord = await prisma.file.create({
    data: {
      name: file.filename || fileName,
      mime: file.type || 'application/octet-stream',
      size: file.data.length,
      path: `/uploads/${uploadDirName}/${fileName}`,
      checksum: hash,
    },
  })

  return {
    id: fileRecord.id,
    name: fileRecord.name,
    size: fileRecord.size,
    type: fileRecord.mime,
    url: fileRecord.path,
  }
})