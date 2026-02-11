import { MemberType } from '~/prisma/generated/client'
import { MembershipTypeData } from '../types'

export const membershipTypes: MembershipTypeData[] = [
  {
    type: MemberType.NORMAL,
    name: 'Socio Normal',
    monthlyFee: 50,
    description: 'Cuota estándar para socios adultos (50€/mes)',
  },
  {
    type: MemberType.JUVENIL,
    name: 'Socio Juvenil',
    monthlyFee: 25,
    description: 'Cuota reducida para menores de 25 años (25€/mes)',
  },
  {
    type: MemberType.FUNDADOR,
    name: 'Socio Fundador',
    monthlyFee: 0,
    description: 'Exento de cuota por ser fundador de la asociación',
  },
]