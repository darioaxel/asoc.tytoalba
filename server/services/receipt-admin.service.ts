import { PrismaClient, ReceiptStatus, User } from '@prisma/client'

export class ReceiptAdminService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Desbloquea recibos para que sean visibles por los socios
   */
  async unlockReceipts(receiptIds: string[], admin: User): Promise<number> {
    const result = await this.prisma.receipt.updateMany({
      where: { 
        id: { in: receiptIds },
        isLocked: true 
      },
      data: {
        isLocked: false,
        unlockedAt: new Date(),
        unlockedById: admin.id
      }
    })

    console.log(`🔓 ${result.count} recibos desbloqueados por ${admin.email}`)
    return result.count
  }

  /**
   * Valida un pago por transferencia (pasa a FULLY_PAID)
   */
  async validatePayment(receiptId: string, admin: User): Promise<void> {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id: receiptId },
      include: { payments: true }
    })

    if (!receipt || receipt.status !== ReceiptStatus.UNDER_REVIEW) {
      throw new Error('Recibo no encontrado o no está en trámite')
    }

    await this.prisma.$transaction(async (tx) => {
      // Actualizar recibo
      await tx.receipt.update({
        where: { id: receiptId },
        data: {
          status: ReceiptStatus.FULLY_PAID,
          paidAmount: receipt.totalAmount,
          paymentDate: new Date(),
          validatedAt: new Date(),
          validatedById: admin.id
        }
      })

      // Actualizar el pago asociado
      const payment = receipt.payments[0]
      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: { registeredById: admin.id }
        })
      }
    })

    console.log(`✅ Recibo ${receipt.number} validado por ${admin.email}`)
  }

  /**
   * Rechaza/devuelve un recibo en trámite
   */
  async rejectPayment(receiptId: string, admin: User, reason: string): Promise<void> {
    await this.prisma.receipt.update({
      where: { id: receiptId },
      data: {
        status: ReceiptStatus.RETURNED,
        returnedAt: new Date(),
        rejectionReason: reason,
        // El recibo sigue visible para que el socio vea el rechazo
      }
    })

    console.log(`❌ Recibo ${receiptId} marcado como devuelto: ${reason}`)
  }
}