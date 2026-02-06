export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const { year } = getQuery(event)
  const fiscalYear = year ? parseInt(year as string) : new Date().getFullYear()

  // Recibos del año solicitado
  const receipts = await prisma.receipt.findMany({
    where: {
      userId: session.user.id,
      fiscalYear,
      deletedAt: null,
    },
    orderBy: { issueDate: 'asc' },
    include: {
      receiptFiles: {
        include: { file: true }
      },
      payments: true,
    },
  })

  // Deuda total (todos los años, solo pendientes y devueltos)
  const debtAggregate = await prisma.receipt.aggregate({
    where: {
      userId: session.user.id,
      status: { in: ['PENDING', 'RETURNED'] },
      deletedAt: null,
    },
    _sum: { totalAmount: true },
  })

  // Años disponibles para tabs (últimos 3 años)
  const currentYear = new Date().getFullYear()
  const availableYears = [currentYear, currentYear - 1, currentYear - 2]

  return {
    receipts,
    debt: debtAggregate._sum.totalAmount ?? 0,
    year: fiscalYear,
    availableYears,
  }
})