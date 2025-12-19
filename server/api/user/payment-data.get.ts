import { isValidSpanishIBAN } from '../../utils/iban'   // si la usas más adelante
import { prisma } from '../../utils/prisma'   // ✅ IMPORTAR

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) throw createError({ statusCode: 401, message: 'No autenticado' })

  const row = await prisma.userPaymentData.findUnique({
    where: { userId: session.user.id },
    select: { paymentMethod: true, iban: true },
  })

  return row ?? { paymentMethod: 'TRANSFERENCIA', iban: null }
})