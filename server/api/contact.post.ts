import { z } from 'zod'
import { TaskType, TaskStatus, Role } from '../../../prisma/generated/client'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Introduce un email válido'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecciona un asunto'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
})

const subjectLabels: Record<string, string> = {
  informacion: 'Información general',
  socio: 'Hacerme socio',
  instalaciones: 'Reserva de instalaciones',
  actividades: 'Actividades y eventos',
  otro: 'Otro'
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('📥 Contacto recibido:', JSON.stringify(body, null, 2))
    
    const validated = contactSchema.parse(body)

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

    // Crear la descripción detallada de la solicitud
    const longDesc = `
**Solicitud de contacto a través de la web**

**Datos del solicitante:**
- Nombre: ${validated.name}
- Email: ${validated.email}
- Teléfono: ${validated.phone || 'No proporcionado'}
- Asunto: ${subjectLabels[validated.subject] || validated.subject}

**Mensaje:**
${validated.message}

**Acciones requeridas:**
1. Contactar al solicitante en el email proporcionado
2. Responder a su consulta

---
Solicitud recibida el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}
    `.trim()

    // Crear la tarea asignada a todos los admins
    const task = await prisma.task.create({
      data: {
        shortDesc: `Contacto web: ${subjectLabels[validated.subject]} - ${validated.name}`,
        longDesc,
        type: TaskType.IMPORTANTE,
        status: TaskStatus.CREADA,
        // Usamos el primer admin como creador
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

    console.log(`✅ Tarea de contacto creada: ${task.id} - ${validated.name}`)

    return {
      success: true,
      message: 'Mensaje enviado correctamente',
      taskId: task.id
    }

  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: error.errors[0]?.message || 'Datos inválidos'
      })
    }

    console.error('❌ Error procesando contacto:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al procesar el mensaje'
    })
  }
})
