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
    const proposal = await prisma.proposal.findUnique({
      where: { id },
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
        votes: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        documents: true,
        images: true,
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

    if (!proposal) {
      throw createError({ statusCode: 404, message: 'Propuesta no encontrada' })
    }

    // Calcular votos
    const upVotes = proposal.votes.filter(v => v.type === 'UP').length
    const downVotes = proposal.votes.filter(v => v.type === 'DOWN').length
    const userVote = proposal.votes.find(v => v.userId === session.user?.id)
    
    // Calcular días restantes
    let daysRemaining = null
    if (proposal.endDate && proposal.status === 'VOTANDO') {
      const now = new Date()
      const end = new Date(proposal.endDate)
      const diffTime = end.getTime() - now.getTime()
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return {
      proposal: {
        ...proposal,
        upVotes,
        downVotes,
        userVoted: !!userVote,
        userVoteType: userVote?.type || null,
        daysRemaining
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Error fetching proposal:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al cargar la propuesta' 
    })
  }
})
