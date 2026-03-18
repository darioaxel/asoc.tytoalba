import type { PrismaClient } from '../../prisma/generated/client'

export default defineNitroPlugin(async () => {
  console.log('[Prisma Plugin] Inicializando cliente...')
  
  const { PrismaClient } = await import('../../prisma/generated/client')
  
  const dbAdapter = process.env.DB_ADAPTER || 'neon'
  let client: PrismaClient
  
  if (dbAdapter === 'pg') {
    console.log('[Prisma Plugin] Usando PrismaPg adapter (PostgreSQL)')
    const { PrismaPg } = await import('@prisma/adapter-pg')
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    client = new PrismaClient({ adapter })
  } else {
    console.log('[Prisma Plugin] Usando PrismaNeon adapter (Neon)')
    const { PrismaNeon } = await import('@prisma/adapter-neon')
    const neonPool = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    client = new PrismaClient({ adapter: neonPool })
  }
  
  // Guardar en global para reutilización
  // @ts-expect-error - extendiendo global
  globalThis.__prisma = client
  
  console.log('[Prisma Plugin] Cliente inicializado correctamente')
})
