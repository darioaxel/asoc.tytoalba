import { PrismaClient } from '../../prisma/generated/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

/**
 * Factory para crear el cliente Prisma con el adaptador adecuado
 * - Desarrollo (Neon): Usa PrismaNeon adapter
 * - Producción (PostgreSQL local): Usa PrismaPg adapter
 * - Fallback: Usa cliente global del plugin si existe
 */
const prismaClientSingleton = () => {
  // Si el plugin de Nitro ya inicializó el cliente, reutilizarlo
  const globalPrisma = (globalThis as any).__prisma
  if (globalPrisma) {
    console.log('[Prisma DB] Usando cliente global del plugin')
    return globalPrisma
  }

  // Fallback: crear cliente según configuración
  const dbAdapter = process.env.DB_ADAPTER || 'neon'
  
  if (dbAdapter === 'pg') {
    // Producción: PostgreSQL local vía pg
    console.log('[Prisma DB] Creando cliente con adaptador pg (Pool)')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    // Desarrollo: Neon serverless
    console.log('[Prisma DB] Creando cliente con adaptador Neon')
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
