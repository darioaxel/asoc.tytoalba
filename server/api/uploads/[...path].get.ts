import { readFile } from 'fs/promises'
import { join } from 'path'
import { stat } from 'fs/promises'

// Mapeo de extensiones a tipos MIME
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

export default defineEventHandler(async (event) => {
  const pathParam = getRouterParam(event, 'path')
  
  if (!pathParam) {
    throw createError({ statusCode: 400, message: 'Path requerido' })
  }

  // Construir ruta segura (evitar path traversal)
  const uploadsDir = join(process.cwd(), 'uploads')
  const filePath = join(uploadsDir, pathParam)
  
  // Verificar que la ruta está dentro de uploads
  if (!filePath.startsWith(uploadsDir)) {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }

  try {
    // Verificar que existe y es un archivo
    const stats = await stat(filePath)
    if (!stats.isFile()) {
      throw createError({ statusCode: 404, message: 'No encontrado' })
    }

    // Determinar tipo MIME
    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    // Leer y servir archivo
    const buffer = await readFile(filePath)
    
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000') // 1 año
    
    return buffer
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: 'Archivo no encontrado' })
    }
    throw createError({ statusCode: 500, message: 'Error al leer archivo' })
  }
})
