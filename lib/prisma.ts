import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  const dbAdapter = process.env.DB_ADAPTER || 'neon'
  
  if (dbAdapter === 'pg') {
    // PostgreSQL local/Docker
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    // Neon.tech
    const neonPool = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({ adapter: neonPool })
  }
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
