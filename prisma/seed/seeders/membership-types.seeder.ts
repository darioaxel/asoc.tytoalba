import { PrismaClient, MembershipType, MemberType } from '../../generated/client'
import { membershipTypes } from '../data/membership-types.js'

export class MembershipTypeSeeder {
  constructor(private prisma: PrismaClient) {}

  async run(): Promise<MembershipType[]> {
    console.log('🏷️  Seed de tipos de membresía...\n')

    const createdTypes: MembershipType[] = []

    for (const typeData of membershipTypes) {
      const existing = await this.prisma.membershipType.findUnique({
        where: { type: typeData.type },
      })

      if (existing) {
        console.log(`✔  Ya existe: ${existing.name} (${existing.monthlyFee}€)`)
        createdTypes.push(existing)
        continue
      }

      const created = await this.prisma.membershipType.create({
        data: typeData,
      })

      console.log(`✔  Creado: ${created.name} (${created.monthlyFee}€/mes)`)
      createdTypes.push(created)
    }

    console.log('')
    return createdTypes
  }
}