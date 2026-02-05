import { z } from 'zod'
import { isValidSpanishIBAN } from '../../utils/iban'

const bodySchema = z.object({
  paymentMethod: z.enum(['TRANSFERENCIA', 'CARGO_BANCARIO']),
  iban: z.string().optional(), // undefined cuando es TRANSFERENCIA
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) throw createError({ statusCode: 401, message: 'No autenticado' })

  const body = await readValidatedBody(event, bodySchema.parse)

  if (body.paymentMethod === 'CARGO_BANCARIO') {
    if (!body.iban || !isValidSpanishIBAN(body.iban)) {
      throw createError({ statusCode: 400, message: 'IBAN español inválido' })
    }
  }

  const data = await prisma.userPaymentData.upsert({
    where: { userId: session.user.id },
    update: {
      paymentMethod: body.paymentMethod,
      iban: body.paymentMethod === 'CARGO_BANCARIO'
        ? body.iban.replace(/\s/g, '').toUpperCase()
        : null,
    },
    create: {
      userId: session.user.id,
      paymentMethod: body.paymentMethod,
      iban: body.paymentMethod === 'CARGO_BANCARIO'
        ? body.iban.replace(/\s/g, '').toUpperCase()
        : null,
    },
    select: { paymentMethod: true, iban: true },
  })

  return data
})