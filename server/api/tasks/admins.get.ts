import { Role } from '../../../prisma/generated/client'

export default defineEventHandler(async () => {
  const admins = await prisma.user.findMany({
    where: { 
      role: Role.ADMIN,
      isActive: true 
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    },
    orderBy: { lastName: 'asc' }
  })
  
  return admins
})