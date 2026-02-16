import { ProposalStatus } from '../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 10))
  const skip = (page - 1) * limit
  
  const status = query.status as string | undefined

  try {
    // Construir where clause
    const where: any = {}
    
    if (status && Object.values(ProposalStatus).includes(status as ProposalStatus)) {
      where.status = status
    }

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
            }
          },
          _count: {
            select: { 
              votes: true,
              responsibles: true,
              documents: true,
              images: true
            }
          }
        }
      }),
      prisma.proposal.count({ where })
    ])

    // Calcular votos positivos y negativos
    const proposalsWithVoteCounts = proposals.map(proposal => {
      const upVotes = proposal.votes.filter(v => v.type === 'UP').length
      const downVotes = proposal.votes.filter(v => v.type === 'DOWN').length
      const userVote = proposal.votes.find(v => v.userId === session.user?.id)
      
      return {
        ...proposal,
        upVotes,
        downVotes,
        userVoted: !!userVote,
        userVoteType: userVote?.type || null
      }
    })

    return {
      proposals: proposalsWithVoteCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    }
  } catch (error) {
    console.error('Error fetching proposals:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al cargar las propuestas' 
    })
  }
})
