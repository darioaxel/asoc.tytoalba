import { VoteType, ProposalStatus } from '../../../../prisma/generated/client'
import { z } from 'zod'

const voteSchema = z.object({
  type: z.enum(['UP', 'DOWN'])
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID de propuesta requerido' })
  }

  try {
    const body = await readBody(event)
    const validated = voteSchema.parse(body)

    // Verificar que la propuesta existe y está en votación
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      select: { 
        id: true, 
        status: true,
        endDate: true,
        creatorId: true
      }
    })

    if (!proposal) {
      throw createError({ statusCode: 404, message: 'Propuesta no encontrada' })
    }

    if (proposal.status !== ProposalStatus.VOTANDO) {
      throw createError({ 
        statusCode: 400, 
        message: 'Esta propuesta ya no está abierta a votación' 
      })
    }

    // Verificar si la votación ha terminado por fecha
    if (proposal.endDate && new Date() > new Date(proposal.endDate)) {
      throw createError({ 
        statusCode: 400, 
        message: 'El período de votación ha terminado' 
      })
    }

    // Verificar si el usuario ya votó
    const existingVote = await prisma.vote.findUnique({
      where: {
        proposalId_userId: {
          proposalId: id,
          userId: session.user.id
        }
      }
    })

    if (existingVote) {
      // Actualizar voto existente
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { 
          type: validated.type as VoteType,
          createdAt: new Date()
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true }
          }
        }
      })

      return {
        success: true,
        message: 'Voto actualizado',
        vote: updatedVote
      }
    }

    // Crear nuevo voto
    const vote = await prisma.vote.create({
      data: {
        type: validated.type as VoteType,
        proposalId: id,
        userId: session.user.id
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    console.log(`✅ Voto ${validated.type} registrado por ${session.user.email} en propuesta ${id}`)

    return {
      success: true,
      message: 'Voto registrado exitosamente',
      vote
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    
    if (error.name === 'ZodError') {
      throw createError({ 
        statusCode: 400, 
        message: error.errors[0]?.message || 'Datos inválidos' 
      })
    }
    
    console.error('Error voting:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al registrar el voto' 
    })
  }
})
