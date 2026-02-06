import { PrismaClient, ReceiptStatus, ReceiptType, MemberType, Prisma } from '@prisma/client'

export class ReceiptGeneratorService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Genera recibos del mes para todos los socios activos
   * Ejecutar el día 25 de cada mes via cron job
   */
  async generateMonthlyReceipts(year: number, month: number): Promise<{
    generated: number
    autoPaid: number
    totalAmount: Decimal
  }> {
    const users = await this.prisma.user.findMany({
      where: { 
        isActive: true,
        role: 'USER',  // solo socios, no admin/root
        memberTypeId: { not: null }  // debe tener tipo de membresía
      },
      include: { memberType: true }
    })

    const results = await this.prisma.$transaction(async (tx) => {
      let generated = 0
      let autoPaid = 0
      let totalAmount = new Prisma.Decimal(0)

      for (const user of users) {
        // Verificar si ya existe recibo para este mes
        const exists = await tx.receipt.findFirst({
          where: {
            userId: user.id,
            fiscalYear: year,
            issueDate: {
              gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
              lt: new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`)
            }
          }
        })

        if (exists) continue

        const baseAmount = user.memberType!.monthlyFee
        const isZeroAmount = baseAmount.equals(0)
        
        // Generar número único: 2024-001-ABCD (últimos 4 del userId)
        const count = await tx.receipt.count({ where: { fiscalYear: year } })
        const number = `${year}-${String(count + 1).padStart(3, '0')}-${user.id.slice(-4)}`

        const receipt = await tx.receipt.create({
          data: {
            number,
            fiscalYear: year,
            type: ReceiptType.MONTHLY_FEE,
            concept: `Cuota ${user.memberType!.name} - ${month}/${year}`,
            baseAmount,
            totalAmount: baseAmount,
            paidAmount: isZeroAmount ? baseAmount : 0,
            status: isZeroAmount ? ReceiptStatus.FULLY_PAID : ReceiptStatus.PENDING,
            isLocked: true,  // No visible hasta desbloqueo ADMIN
            issueDate: new Date(`${year}-${String(month).padStart(2, '0')}-25`),
            dueDate: new Date(`${year}-${String(month). 1).padStart(2, '0')}-15`),
            paymentDate: isZeroAmount ? new Date() : null,
            userId: user.id,
          }
        })

        generated++
        totalAmount = totalAmount.add(baseAmount)
        if (isZeroAmount) autoPaid++

        console.log(`${isZeroAmount ? '✅' : '⏳'} Recibo ${receipt.number}: ${receipt.concept} - ${baseAmount}€`)
      }

      return { generated, autoPaid, totalAmount }
    })

    return results
  }
}