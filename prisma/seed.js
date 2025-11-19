import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = "root@example.com"
  const password = "root1234"

  const exists = await prisma.user.findUnique({ where: { email } })

  if (exists) {
    console.log("El usuario root ya existe. No se crea uno nuevo.")
    return
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: Role.ROOT
    }
  })

  console.log("Usuario ROOT creado con éxito:")
  console.log("email:", email)
  console.log("password:", password)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
