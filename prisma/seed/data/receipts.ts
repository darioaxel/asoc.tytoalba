import { MemberType, ReceiptStatus, PaymentMethod } from '../../generated/client'
import { ReceiptScenarioType, MonthConfig } from '../types.js'

// Configuración de escenarios por email de usuario
export const receiptScenarios: Record<string, ReceiptScenarioType> = {
  'user1@example.com': 'perfect',
  'user2@example.com': 'with_returns',
  'user3@example.com': 'unpaid_last_3',
  'user4@example.com': 'random',
  'founder@example.com': 'zero_fee',
  'user5@example.com': 'mixed_review',
  'user6@example.com': 'perfect',
}

// Helper para obtener escenario por email
export function getScenarioType(email: string): ReceiptScenarioType {
  return receiptScenarios[email] || 'random'
}

// Builder de escenarios mensuales (24 meses)
export function buildScenario(
  type: ReceiptScenarioType,
  baseFee: number
): MonthConfig[] {
  const months: MonthConfig[] = []

  switch (type) {
    case 'perfect':
      // 24 meses pagados
      for (let i = 0; i < 24; i++) {
        months.push({
          status: ReceiptStatus.FULLY_PAID,
          baseAmount: baseFee,
          isLocked: false,
          paymentMethod: Math.random() > 0.5 ? 'CARGO_BANCARIO' : 'TRANSFERENCIA',
        })
      }
      break

    case 'with_returns':
      // 2 devoluciones: mes 6 (Jun 2024) y mes 18 (Jun 2025)
      // Con recargo al mes siguiente
      for (let i = 0; i < 24; i++) {
        const isReturnMonth = i === 5 || i === 17
        const isAfterReturn = i === 6 || i === 18

        if (isReturnMonth) {
          months.push({
            status: ReceiptStatus.RETURNED,
            baseAmount: baseFee,
            isLocked: false,
            rejectedByAdmin: true,
            rejectionReason: 'Devolución bancaria - fondos insuficientes',
          })
        } else if (isAfterReturn) {
          months.push({
            status: ReceiptStatus.FULLY_PAID,
            baseAmount: baseFee,
            returnCharge: 5,
            isLocked: false,
            paymentMethod: 'TRANSFERENCIA',
            paymentReference: `Regularización + recargo devolución`,
          })
        } else {
          months.push({
            status: ReceiptStatus.FULLY_PAID,
            baseAmount: baseFee,
            isLocked: false,
          })
        }
      }
      break

    case 'unpaid_last_3':
      // 21 meses pagados, últimos 3 pendientes
      for (let i = 0; i < 21; i++) {
        months.push({
          status: ReceiptStatus.FULLY_PAID,
          baseAmount: baseFee,
          isLocked: false,
        })
      }
      for (let i = 21; i < 24; i++) {
        months.push({
          status: ReceiptStatus.PENDING,
          baseAmount: baseFee,
          isLocked: i === 21, // Solo el más reciente bloqueado
        })
      }
      break

    case 'zero_fee':
      // Fundador: cuota 0, auto-pagados
      for (let i = 0; i < 24; i++) {
        months.push({
          status: ReceiptStatus.FULLY_PAID,
          baseAmount: 0,
          isLocked: false,
        })
      }
      break

    case 'mixed_review':
      // 60% pagados, 20% en trámite, 20% pendientes
      for (let i = 0; i < 24; i++) {
        const rand = Math.random()
        if (rand < 0.6) {
          months.push({
            status: ReceiptStatus.FULLY_PAID,
            baseAmount: baseFee,
            isLocked: false,
          })
        } else if (rand < 0.8) {
          months.push({
            status: ReceiptStatus.UNDER_REVIEW,
            baseAmount: baseFee,
            isLocked: false,
            withTransferReceipt: true,
          })
        } else {
          months.push({
            status: ReceiptStatus.PENDING,
            baseAmount: baseFee,
            isLocked: i > 20,
          })
        }
      }
      break

    case 'random':
    default:
      // 50/50 pagado/pendiente
      for (let i = 0; i < 24; i++) {
        const isPaid = Math.random() > 0.5
        months.push({
          status: isPaid ? ReceiptStatus.FULLY_PAID : ReceiptStatus.PENDING,
          baseAmount: baseFee,
          isLocked: !isPaid && i > 20,
        })
      }
  }

  return months
}