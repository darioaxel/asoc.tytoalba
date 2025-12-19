// ~/server/api/user.get.ts
import { prisma } from '../utils/prisma'


export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,   
      emailPersonal: true,
      firstName: true,
      lastName: true,
      fullName: true,
      phone: true,
      dni: true,
      birthDate: true,
      picture: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user || !user.isActive) {
    // borramos la sesión por si acaso
    await clearUserSession(event)
    return null
  }

  return {
    id: user.id,
    email: user.email,  
    emailPersonal: user.emailPersonal,
    name: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    phone: user.phone,
    dni: user.dni,
    birthDate: user.birthDate,
    picture: user.picture,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    loggedInAt: session.loggedInAt,
  }
})