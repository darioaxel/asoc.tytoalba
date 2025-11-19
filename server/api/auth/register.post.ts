import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role } = body

  // Validaciones básicas
  if (!email || !password) {
    throw createError({ statusCode: 400, message: "Email y password requeridos" })
  }

  const exists = await prisma.user.findUnique({ where: { email } })

  if (exists) {
    throw createError({ statusCode: 400, message: "El usuario ya existe" })
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10)

  // Crear usuario con rol (o user si no lo especifican)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: role ? role.toUpperCase() as Role : Role.USER
    }
  })

  // Guardamos sesión en auth-utils
  const session = useUserSession(event)
  await session.update({
    user: {
      id: user.id,
      email: user.email,
      role: user.role.toLowerCase()  // admin → "admin"
    }
  })

  return { ok: true }
})
