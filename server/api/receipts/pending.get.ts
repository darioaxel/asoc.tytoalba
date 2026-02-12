export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const receipts = await prisma.receipt.findMany({
    where: {
      userId: session.user.id,
      status: 'PENDING',
      isLocked: false,
      deletedAt: null,
    },
    orderBy: { dueDate: 'asc' },
    select: {
      id: true,
      number: true,
      fiscalYear: true,
      concept: true,
      totalAmount: true,
      dueDate: true,
      issueDate: true,
    },
  })

  const totalDebt = receipts.reduce((sum, r) => sum + Number(r.totalAmount), 0)

  return {
    receipts,
    totalDebt,
    count: receipts.length,
  }
})