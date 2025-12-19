// ~/server/api/auth/login.post.ts
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '../../utils/prisma'

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)
  
  console.log('=== 🔐 INICIO LOGIN ===')
  console.log('📧 Email recibido:', body.email)
  console.log('🔑 Password recibida:', body.password)
  
  // Buscar usuario con TODOS los campos necesarios
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: {
      id: true,
      email: true,  
      role: true,
      isActive: true,
      passwordHash: true,
      failedLoginAttempts: true,      
    }
  })
  
  console.log('👤 Usuario encontrado:', user)
  console.log('✅ Usuario activo:', user?.isActive)
  console.log('🔐 Tiene passwordHash:', !!user?.passwordHash)

  // ✅ Verificación PASO A PASO
  if (!user) {
    console.log('❌ ERROR: Usuario no encontrado')
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  if (!user.isActive) {
    console.log('❌ ERROR: Usuario inactivo')
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  if (!user.passwordHash) {
    console.log('❌ ERROR: Sin passwordHash (usuario OAuth?)')
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  console.log('🔐 Comparando passwords...')
  console.log('📥 Password plana:', body.password)
  console.log('🗃️ Password hash:', user.passwordHash.substring(0, 20) + '...')

  const valid = await bcrypt.compare(body.password, user.passwordHash)
  console.log('✅ Resultado bcrypt.compare:', valid)

  if (!valid) {
    console.log('❌ ERROR: Password incorrecta')
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: { increment: 1 } },
    })
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  console.log('🎉 LOGIN EXITOSO para:', user.email)

  // Actualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lastLoginAt: new Date() },
  })

  // Crear sesión
  await setUserSession(event, {
    user: { id: user.id, email: user.email, role: user.role },
    loggedInAt: new Date(),
  })

  console.log('=== ✅ LOGIN COMPLETADO ===')

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,     
      role: user.role,
    },
  }
})