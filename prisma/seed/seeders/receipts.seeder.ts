import {
  PrismaClient,
  User,
  Receipt,
  ReceiptStatus,
  ReceiptType,
  MemberType,
  MembershipType,
} from '../../generated/client'
import { MonthConfig } from '../types.js'
import { getScenarioType, buildScenario } from '../data/receipts.js'

export class ReceiptSeeder {
  private currentYear = 2024
  private adminUsers: User[] = []

  constructor(private prisma: PrismaClient) {}

  async run(users: User[]): Promise<Receipt[]> {
    console.log('\n🧾 Seed de recibos (2 años: 2024-2025)...\n')

    // Filtrar solo socios con memberType
    const members = users.filter((u) => u.role === 'USER' && u.memberTypeId)
    this.adminUsers = users.filter((u) => u.role === 'ADMIN' || u.role === 'ROOT')

    const createdReceipts: Receipt[] = []

    for (const member of members) {
      const memberType = await this.prisma.membershipType.findUnique({
        where: { id: member.memberTypeId! },
      })

      if (!memberType) continue

      const scenarioType = getScenarioType(member.email)
      const scenario = buildScenario(scenarioType, memberType.monthlyFee.toNumber())

      console.log(
        `\n📋 ${member.firstName} ${member.lastName} [${memberType.type}] - ${scenarioType}`
      )

      for (let i = 0; i < 24; i++) {
        const year = this.currentYear + Math.floor(i / 12)
        const month = (i % 12) + 1
        const monthConfig = scenario[i]

        const receipt = await this.createReceipt(member, year, month, monthConfig, memberType)
        createdReceipts.push(receipt)

        this.logReceipt(receipt, monthConfig)
      }
    }

    console.log(`\n✔ Total recibos creados: ${createdReceipts.length}`)
    return createdReceipts
  }

  private calculateDueDate(year: number, month: number): Date {
  // Si es diciembre, vence en enero del año siguiente
  if (month === 12) {
    return new Date(`${year + 1}-01-15`)
  }
  return new Date(`${year}-${String(month + 1).padStart(2, '0')}-15`)
}

private async createReceipt(
  user: User,
  year: number,
  month: number,
  config: MonthConfig,
  memberType: MembershipType
): Promise<Receipt> {
  const number = `${year}-${String(month).padStart(3, '0')}-${user.id.slice(-4)}`

  const existing = await this.prisma.receipt.findUnique({
    where: {
      number_fiscalYear: {
        number,
        fiscalYear: year,
      },
    },
  })
  
  if (existing) return existing

  const totalAmount = config.baseAmount + (config.returnCharge || 0)
  const isPaid = config.status === ReceiptStatus.FULLY_PAID
  const isZeroFee = totalAmount === 0

  const finalStatus = isZeroFee ? ReceiptStatus.FULLY_PAID : config.status

  const receipt = await this.prisma.receipt.create({
    data: {
      number,
      fiscalYear: year,
      type: config.returnCharge ? ReceiptType.BANK_RETURN_CHARGE : ReceiptType.MONTHLY_FEE,
      concept: this.buildConcept(year, month, config, memberType.type as MemberType),
      baseAmount: config.baseAmount,
      returnCharge: config.returnCharge || 0,
      totalAmount,
      paidAmount: isPaid || isZeroFee ? totalAmount : 0,
      status: finalStatus,
      isLocked: config.isLocked ?? true,
      unlockedAt: config.isLocked ? null : new Date(),
      unlockedById: config.isLocked ? null : this.getAdminId(),
      issueDate: new Date(`${year}-${String(month).padStart(2, '0')}-25`),
      dueDate: this.calculateDueDate(year, month),  // ← CORREGIDO
      paymentDate: isPaid || isZeroFee ? this.randomPaymentDate(year, month) : null,
      validatedAt: config.validatedByAdmin ? new Date() : null,
      validatedById: config.validatedByAdmin ? this.getAdminId() : null,
      returnedAt: config.rejectedByAdmin ? new Date() : null,
      rejectionReason: config.rejectionReason || null,
      userId: user.id,
    },
  })

    // Crear pago asociado si aplica
    if (isPaid && !isZeroFee && config.paymentMethod) {
      await this.prisma.payment.create({
        data: {
          receiptId: receipt.id,
          amount: totalAmount,
          method: config.paymentMethod,
          reference: config.paymentReference,
          registeredById: config.validatedByAdmin ? this.getAdminId() : null,
        },
      })
    }

    // Crear archivo de justificante si está en trámite
    if (config.withTransferReceipt) {
      await this.createTransferReceiptFile(receipt.id, number)
    }

    return receipt
  }

  private async createTransferReceiptFile(receiptId: string, number: string): Promise<void> {
    const file = await this.prisma.file.create({
      data: {
        name: `justificante_${number}.pdf`,
        mime: 'application/pdf',
        size: 102400,
        path: `/uploads/receipts/${number}.pdf`,
        checksum: `mock_checksum_${number}`,
      },
    })

    await this.prisma.receiptFile.create({
      data: {
        receiptId,
        fileId: file.id,
        fileType: 'transfer_receipt',
      },
    })
  }

  private getAdminId(): string | undefined {
    return this.adminUsers[0]?.id
  }

  private buildConcept(
    year: number,
    month: number,
    config: MonthConfig,
    memberType: MemberType
  ): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ]
    const monthName = monthNames[month - 1]

    if (config.returnCharge) {
      return `Cuota ${memberType} ${monthName} ${year} + recargo devolución`
    }
    if (config.rejectedByAdmin) {
      return `Cuota ${memberType} ${monthName} ${year} (DEVUELTA)`
    }
    return `Cuota ${memberType} ${monthName} ${year}`
  }

  private randomPaymentDate(year: number, month: number): Date {
    const day = Math.floor(Math.random() * 10) + 1
    return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  }

  private logReceipt(receipt: Receipt, config: MonthConfig): void {
    const icons: Record<string, string> = {
      FULLY_PAID: '✅',
      PENDING: '⏳',
      UNDER_REVIEW: '👀',
      RETURNED: '❌',
    }
    const icon = icons[receipt.status] || '⚪'
    const extra = config.returnCharge ? ` (+${config.returnCharge}€)` : ''
    const locked = receipt.isLocked ? '🔒' : '🔓'
    console.log(`  ${icon}${locked} ${receipt.number}: ${receipt.totalAmount}€${extra} [${receipt.status}]`)
  }
}