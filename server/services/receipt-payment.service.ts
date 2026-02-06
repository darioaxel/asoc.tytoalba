import { PrismaClient, ReceiptStatus, PaymentMethod, Receipt } from '@prisma/client'

export class ReceiptPaymentService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Socio sube justificante de transferencia
   * → Recibo pasa a UNDER_REVIEW
   */
  async submitTransferReceipt(
    receiptId: string, 
    userId: string,
    fileId: string,
    reference?: string
  ): Promise<Receipt> {
    const receipt = await this.prisma.receipt.findFirst({
      where: { 
        id: receiptId,
        userId,  // seguridad: solo su propio recibo
        isLocked: false  // debe estar desbloqueado
      }
    })

    if (!receipt) throw new Error('Recibo no encontrado o no disponible')
    if (receipt.status !== ReceiptStatus.PENDING) {
      throw new Error('El recibo ya no está pendiente de pago')
    }

    return this.prisma.$transaction(async (tx) => {
      // Crear relación archivo-recibo
      const receiptFile = await tx.receiptFile.create({
        data: {
          receiptId,
          fileId,
          fileType: 'transfer_receipt'
        }
      })

      // Crear pago pendiente de validación
      await tx.payment.create({
        data: {
          receiptId,
          amount: receipt.totalAmount,
          method: PaymentMethod.TRANSFERENCIA,
          reference,
          receiptFileId: receiptFile.id
        }
      })

      // Actualizar estado
      return tx.receipt.update({
        where: { id: receiptId },
        data: { status: ReceiptStatus.UNDER_REVIEW }
      })
    })
  }

  /**
   * Pago en efectivo/ingreso (registrado por admin)
   */
  async registerCashPayment(
    receiptId: string,
    adminId: string,
    amount: number
  ): Promise<Receipt> {
    return this.prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          receiptId,
          amount,
          method: PaymentMethod.EFECTIVO,
          registeredById: adminId
        }
      })

      return tx.receipt.update({
        where: { id: receiptId },
        data: {
          status: ReceiptStatus.FULLY_PAID,
          paidAmount: amount,
          paymentDate: new Date(),
          validatedAt: new Date(),
          validatedById: adminId
        }
      })
    })
  }
}