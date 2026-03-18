import { PrismaClient } from '../../prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // Usar cliente global del plugin si existe
  const globalPrisma = (globalThis as any).__prisma
  if (globalPrisma) {
    return globalPrisma
  }

  const dbAdapter = process.env.DB_ADAPTER || 'neon'
  
  if (dbAdapter === 'pg') {
    // PostgreSQL local/Docker
    console.log('[Prisma DB] Usando PrismaPg adapter (PostgreSQL)')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    // Neon.tech
    console.log('[Prisma DB] Usando PrismaNeon adapter (Neon)')
    const neonPool = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({ adapter: neonPool })
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
