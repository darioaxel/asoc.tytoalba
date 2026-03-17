import { PrismaClient } from '../../prisma/generated/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

/**
 * Factory para crear el cliente Prisma con el adaptador adecuado
 * - Desarrollo (Neon): Usa PrismaNeon adapter
 * - Producción (PostgreSQL local): Usa PrismaPg adapter
 */
const prismaClientSingleton = () => {
  const dbAdapter = process.env.DB_ADAPTER || 'neon'
  
  if (dbAdapter === 'pg') {
    // Producción: PostgreSQL local vía pg
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    // Desarrollo: Neon serverless
    const pool = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({ adapter: pool })
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma