// task.seeder.ts
import { Task, Role } from '../../generated/client'
import { prisma } from '../config.js'
import { rawTasks } from '../data/tasks'

export class TaskSeeder {
  async run(users: { id: string; email: string; role: Role }[]): Promise<Task[]> {
    console.log('\n📋 Seed de tareas...\n')
    
    // Convertir array a Map para búsqueda rápida por email
    const userMap = new Map(users.map(u => [u.email, u]))
    const createdTasks: Task[] = []

    for (const taskData of rawTasks) {
      const creator = userMap.get(taskData.creatorEmail)
      if (!creator) {
        console.warn(`⚠️  Creador no encontrado: ${taskData.creatorEmail}, saltando`)
        continue
      }

      // Resolver asignados
      const assigneeIds = taskData.assigneeEmails
        .map(email => userMap.get(email)?.id)
        .filter((id): id is string => id !== undefined)

      // Resolver validador (debe ser ADMIN o ROOT)
      let validatorId: string | null = null
      if (taskData.validatorEmail) {
        const validator = userMap.get(taskData.validatorEmail)
        if (validator && (validator.role === Role.ADMIN || validator.role === Role.ROOT)) {
          validatorId = validator.id
        } else {
          console.warn(`⚠️  Validador inválido: ${taskData.validatorEmail}`)
        }
      }

      const task = await prisma.task.create({
        data: {
          shortDesc: taskData.shortDesc,
          longDesc: taskData.longDesc,
          type: taskData.type,
          status: taskData.status,
          creatorId: creator.id,
          validatorId,
          startDate: taskData.startDate,
          endDate: taskData.endDate,
          resolvedAt: taskData.resolvedAt,
          assignees: assigneeIds.length > 0 ? {
            create: assigneeIds.map(userId => ({
              userId,
              assignedAt: new Date()
            }))
          } : undefined,
          documents: taskData.documents ? {
            create: taskData.documents
          } : undefined
        }
      })

      console.log(`✔  ${task.shortDesc.substring(0, 40).padEnd(40)} [${task.type} | ${task.status}]`)
      createdTasks.push(task)
    }

    console.log(`\n✅ ${createdTasks.length} tareas creadas`)
    return createdTasks
  }
}