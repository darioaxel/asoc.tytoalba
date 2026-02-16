import { ProposalStatus } from '../../../prisma/generated/client'
import { z } from 'zod'

const createProposalSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(255, 'Máximo 255 caracteres'),
  summary: z.string().min(1, 'El resumen es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  responsibleIds: z.array(z.string().uuid()).optional(),
  documentIds: z.array(z.string().uuid()).optional(),
  imageIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  try {
    const body = await readBody(event)
    const validated = createProposalSchema.parse(body)

    // Verificar que los documentos existen si se proporcionan
    let fileDocuments: any[] = []
    if (validated.documentIds && validated.documentIds.length > 0) {
      const files = await prisma.file.findMany({
        where: { id: { in: validated.documentIds } }
      })
      if (files.length !== validated.documentIds.length) {
        throw createError({ 
          statusCode: 400, 
          message: 'Algunos documentos no existen' 
        })
      }
      fileDocuments = files.map(file => ({
        filename: file.name,
        originalName: file.name,
        mimeType: file.mime,
        size: file.size,
        url: file.path,
      }))
    }

    // Verificar que las imágenes existen si se proporcionan
    let fileImages: any[] = []
    if (validated.imageIds && validated.imageIds.length > 0) {
      const files = await prisma.file.findMany({
        where: { id: { in: validated.imageIds } }
      })
      if (files.length !== validated.imageIds.length) {
        throw createError({ 
          statusCode: 400, 
          message: 'Algunas imágenes no existen' 
        })
      }
      fileImages = files.map(file => ({
        filename: file.name,
        originalName: file.name,
        mimeType: file.mime,
        size: file.size,
        url: file.path,
      }))
    }

    // Verificar que los responsables existen si se proporcionan
    let responsibles: any[] = []
    if (validated.responsibleIds && validated.responsibleIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { 
          id: { in: validated.responsibleIds },
          isActive: true 
        }
      })
      
      if (users.length !== validated.responsibleIds.length) {
        throw createError({ 
          statusCode: 400, 
          message: 'Algunos responsables no existen o están inactivos' 
        })
      }
      
      responsibles = validated.responsibleIds.map(userId => ({
        userId,
        assignedAt: new Date()
      }))
    }

    // Crear la propuesta
    const proposal = await prisma.proposal.create({
      data: {
        title: validated.title,
        summary: validated.summary,
        description: validated.description,
        status: ProposalStatus.VOTANDO,
        creatorId: session.user.id,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        responsibles: responsibles.length > 0 ? {
          create: responsibles
        } : undefined,
        documents: fileDocuments.length > 0 ? {
          create: fileDocuments
        } : undefined,
        images: fileImages.length > 0 ? {
          create: fileImages
        } : undefined
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        responsibles: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        },
        votes: true,
        _count: {
          select: { 
            votes: true,
            responsibles: true,
            documents: true,
            images: true
          }
        }
      }
    })

    console.log(`✅ Propuesta ${proposal.id} creada por ${session.user.email}`)

    return {
      success: true,
      message: 'Propuesta creada exitosamente',
      proposal
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    if (error.name === 'ZodError') {
      throw createError({ 
        statusCode: 400, 
        message: error.errors[0]?.message || 'Datos inválidos' 
      })
    }
    
    console.error('❌ Error creando propuesta:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al crear la propuesta' 
    })
  }
})
