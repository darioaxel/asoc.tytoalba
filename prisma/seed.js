// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const users = [
  {
    email: 'root@example.com',
    password: 'root1234',
    role: Role.ROOT,
    firstName: 'Root',
    lastName: 'System',
    dni: '00000000A',
    phone: '+34000000000',
    birthDate: new Date('1980-01-01'),
    isActive: true,
  },
  {
    email: 'admin1@example.com',
    password: 'admin1234',
    role: Role.ADMIN,
    firstName: 'Carlos',
    lastName: 'Gómez',
    dni: '11111111B',
    phone: '+34111111111',
    birthDate: new Date('1985-05-10'),
    isActive: true,
  },
  {
    email: 'admin2@example.com',
    password: 'admin1234',
    role: Role.ADMIN,
    firstName: 'Laura',
    lastName: 'Fernández',
    dni: '22222222C',
    phone: '+34222222222',
    birthDate: new Date('1990-08-15'),
    isActive: true,
  },
  {
    email: 'user1@example.com',
    password: 'user1234',
    role: Role.USER,
    firstName: 'Ana',
    lastName: 'Martínez',
    dni: '33333333D',
    phone: '+34333333333',
    birthDate: new Date('1992-03-22'),
    isActive: true,
  },
  {
    email: 'user2@example.com',
    password: 'user1234',
    role: Role.USER,
    firstName: 'Luis',
    lastName: 'Sánchez',
    dni: '44444444E',
    phone: '+34444444444',
    birthDate: new Date('1995-11-30'),
    isActive: true,
  },
]

async function main() {
  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } })
    if (exists) {
      console.log(`✅ Ya existe: ${u.email}`)
      continue
    }

    const hashed = await bcrypt.hash(u.password, 10)

    await prisma.user.create({
      data: {
        ...u,
        password: hashed,
        fullName: `${u.firstName} ${u.lastName}`,
        emailPersonal: u.email,
        emailCenter: u.email,
        picture: `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random`,
      },
    })

    console.log(`✅ Creado: ${u.email} (${u.role})`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })