// 1. Primero importa Prisma con el método que funciona con pnpm
import { PrismaClient } from '@prisma/client'

// 2. Crea la instancia (o usa el singleton si lo configuraste)
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) return null

  // Opcional: Obtener datos frescos de la base de datos
  // (en lugar de confiar solo en la sesión)
  const userFromDb = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    }
  })

  return {
    id: userFromDb?.id || session.user.id,
    email: userFromDb?.email || session.user.email,
    role: userFromDb?.role || session.user.role,
    loggedInAt: session.loggedInAt,
  }
})