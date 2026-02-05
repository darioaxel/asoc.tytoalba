import { Role } from '@prisma/client'

export interface UserData {
  email: string
  password: string
  role: Role
  firstName: string
  lastName: string
  dni: string
  phone: string
  birthDate: Date
  emailPersonal: string
  address?: {
    addressLine: string
    floorDoor?: string
    postalCode: string
    locality: string
    province: string
  }
}

export interface PostData {
  title: string
  excerpt: string
  content: string
  cover: string
  tags: string[]
  published: boolean
  publishedAt: Date
}