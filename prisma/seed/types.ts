import { Role, ReceiptStatus, ReceiptType, MemberType, PaymentMethod } from '@prisma/client'

// ========== DATOS BASE ==========

export interface AddressData {
  addressLine: string
  floorDoor?: string
  postalCode: string
  locality: string
  province: string
}

export interface UserData {
  email: string
  password: string
  role: Role
  firstName: string
  lastName: string
  dni: string
  phone: string
  birthDate: Date
  emailPersonal: string
  address?: AddressData
  // Nuevos campos para membresía
  memberType?: MemberType
  receiptScenario?: ReceiptScenarioType
}

export interface PostData {
  title: string
  excerpt: string
  content: string
  cover: string
  tags: string[]
  published: boolean
  publishedAt: Date
}

// ========== MEMBRESÍA ==========

export interface MembershipTypeData {
  type: MemberType
  name: string
  monthlyFee: number
  description: string
}

// ========== ESCENARIOS DE RECIBOS ==========

export type ReceiptScenarioType = 
  | 'perfect'           // Todo pagado correctamente
  | 'with_returns'      // Devoluciones bancarias con recargo
  | 'unpaid_last_3'     // Últimos 3 meses impagados
  | 'random'            // 50% pagado, 50% pendiente
  | 'zero_fee'          // Cuota 0 (fundador), auto-pagado
  | 'mixed_review'      // Algunos en trámite de validación

// Configuración mensual detallada (usado por el seeder)
export interface MonthConfig {
  status: ReceiptStatus
  baseAmount: number
  returnCharge?: number
  isLocked?: boolean           // Visible o no para el socio
  withTransferReceipt?: boolean // Si subió justificante (UNDER_REVIEW)
  validatedByAdmin?: boolean    // Si fue validado (FULLY_PAID)
  rejectedByAdmin?: boolean     // Si fue rechazado (RETURNED)
  rejectionReason?: string
  paymentMethod?: PaymentMethod
  paymentReference?: string
}

// Escenario completo para 24 meses
export interface UserReceiptScenario {
  userIndex: number           // Índice en rawUsers
  memberType: MemberType
  months: MonthConfig[]
}

// ========== DATOS DE PAGO ==========

export interface PaymentData {
  amount: number
  method: PaymentMethod
  reference?: string
  receiptFileId?: string      // ID del archivo subido
  registeredById?: string     // Admin que registró el pago
}

// ========== DATOS DE ARCHIVOS ==========

export interface FileData {
  name: string
  mime: string
  size: number
  path: string
  checksum: string
}
