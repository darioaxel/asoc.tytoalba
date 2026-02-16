import { z } from 'zod'
import { TaskType, TaskStatus, Role } from '../../../prisma/generated/client'

const solicitudSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
  lastName: z.string().min(1, 'Los apellidos son obligatorios').max(100),
  email: z.string().email('El email no es válido'),
  age: z.number().int().min(1, 'La edad no es válida').max(120, 'La edad no es válida'),
  message: z.string().max(1000, 'El mensaje es demasiado largo').optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('📥 Body recibido:', JSON.stringify(body, null, 2))
    const validated = solicitudSchema.parse(body)

    // Buscar usuarios con rol ADMIN o ROOT para asignarles la tarea
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.ADMIN, Role.ROOT]
        },
        isActive: true
      },
      select: { id: true }
    })

    const adminIds = admins.map(admin => admin.id)

    // Determinar si es menor de edad para el mensaje
    const esMenor = validated.age < 18
    const tipoSolicitud = esMenor ? 'Solicitud de socio (MENOR DE EDAD)' : 'Solicitud de nuevo socio'

    // Crear la descripción detallada de la solicitud
    const longDesc = `
**Solicitud de inscripción como socio**

**Datos del solicitante:**
- Nombre: ${validated.firstName}
- Apellidos: ${validated.lastName}
- Email: ${validated.email}
- Edad: ${validated.age} años${esMenor ? ' (MENOR DE EDAD)' : ''}

${validated.message ? `**Mensaje del solicitante:**\n${validated.message}` : ''}

**Acciones requeridas:**
1. Contactar al solicitante en el email proporcionado
2. Solicitar documentación necesaria (DNI${esMenor ? ' del tutor y documento de consentimiento firmado' : ''}, IBAN)
3. Completar proceso de alta en el sistema

---
Solicitud recibida el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}
    `.trim()

    // Crear la tarea asignada a todos los admins
    const task = await prisma.task.create({
      data: {
        shortDesc: `${tipoSolicitud} - ${validated.firstName} ${validated.lastName}`,
        longDesc,
        type: TaskType.IMPORTANTE,
        status: TaskStatus.CREADA,
        // Como es una solicitud pública, no hay un creador (usuario autenticado)
        // Usamos el primer admin como creador si existe, o null
        creatorId: adminIds[0] || undefined,
        assignees: adminIds.length > 0 ? {
          create: adminIds.map(userId => ({
            userId,
            assignedAt: new Date()
          }))
        } : undefined
      },
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        }
      }
    })

    console.log(`✅ Solicitud de socio creada: ${task.id} - ${validated.firstName} ${validated.lastName}`)

    return {
      success: true,
      message: 'Solicitud enviada correctamente',
      taskId: task.id
    }

  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: error.errors[0]?.message || 'Datos inválidos'
      })
    }

    console.error('❌ Error procesando solicitud:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al procesar la solicitud'
    })
  }
})
