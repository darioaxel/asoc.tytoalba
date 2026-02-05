import type { TaskType, TaskStatus } from '../../prisma/generated/client'

export interface TaskWithRelations {
  id: string
  shortDesc: string
  longDesc: string | null
  type: TaskType
  status: TaskStatus
  createdAt: string | Date
  startDate: string | Date | null
  endDate: string | Date | null
  resolvedAt: string | Date | null
  creator: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  assignees: {
    user: {
      id: string
      firstName: string | null
      lastName: string | null
      email: string
    }
  }[]
  validator?: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  } | null
  documents: {
    id: string
    filename: string
    url: string
  }[]
  _count?: {
    assignees: number
    documents: number
  }
}

export interface TaskFilters {
  status?: TaskStatus
  type?: TaskType
  search?: string
  page?: number
  limit?: number
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  CREADA: 'Creada',
  ASIGNADA: 'Asignada',
  EN_CURSO: 'En curso',
  RESUELTA: 'Resuelta',
  ESPERANDO_VALIDACION: 'Esperando validación'
}

export const taskTypeLabels: Record<TaskType, string> = {
  IMPORTANTE: 'Importante',
  URGENTE: 'Urgente',
  PROPUESTA: 'Propuesta'
}

export const taskStatusColors: Record<TaskStatus, string> = {
  CREADA: 'bg-slate-100 text-slate-800',
  ASIGNADA: 'bg-blue-100 text-blue-800',
  EN_CURSO: 'bg-yellow-100 text-yellow-800',
  RESUELTA: 'bg-green-100 text-green-800',
  ESPERANDO_VALIDACION: 'bg-purple-100 text-purple-800'
}

export const taskTypeColors: Record<TaskType, string> = {
  IMPORTANTE: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENTE: 'bg-red-100 text-red-800 border-red-200',
  PROPUESTA: 'bg-cyan-100 text-cyan-800 border-cyan-200'
}