export default defineEventHandler(async (event) => {
  try {
    const types = await prisma.membershipType.findMany({
      orderBy: { createdAt: 'asc' }
    })

    return types
  } catch (error) {
    console.error('Error fetching membership types:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los tipos de membresía'
    })
  }
})
