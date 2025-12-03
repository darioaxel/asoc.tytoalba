// prisma/seed.js
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

// Datos de usuarios con información completa
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
    emailPersonal: 'root.personal@example.com',
    address: {
      addressLine: 'Calle de la Seguridad 42',
      floorDoor: 'Bajo',
      postalCode: '28001',
      locality: 'Madrid',
      province: 'Madrid',
     
    },
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
    emailPersonal: 'carlos.gomez@email.com',
    address: {
      addressLine: 'Avenida de la Asociación 123',
      floorDoor: '3º B',
      postalCode: '46001',
      locality: 'Valencia',
      province: 'Valencia',
     
    },
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
    emailPersonal: 'laura.fernandez@email.com',
    address: {
      addressLine: 'Plaza del Voluntariado 8',
      floorDoor: '1º Izq',
      postalCode: '41001',
      locality: 'Sevilla',
      province: 'Sevilla',
   
    },
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
    emailPersonal: 'ana.martinez@email.com',
    // Sin dirección para este usuario
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
    emailPersonal: 'luis.sanchez@email.com',
    address: {
      addressLine: 'Calle del Usuario 99',
      floorDoor: 'Bajo Dcha',
      postalCode: '08001',
      locality: 'Barcelona',
      province: 'Barcelona',
  
    },
  },
]

async function main() {
  console.log('🌱 Iniciando seed...\n')

  for (const u of users) {
    // Verificar si el usuario ya existe
    const exists = await prisma.user.findUnique({ 
      where: { email: u.email } 
    })

    if (exists) {
      console.log(`✅ Ya existe: ${u.email} (${u.role})`)
      continue
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(u.password, 12)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: u.email,
        emailPersonal: u.emailPersonal,   
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`,
        phone: u.phone,
        dni: u.dni,
        birthDate: u.birthDate,
        passwordHash: hashedPassword, // ✅ CAMPO CORRECTO
        role: u.role,
        isActive: true,
        failedLoginAttempts: 0, // ✅ CAMPO NUEVO
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName + '+' + u.lastName)}&background=random`,
        // Crear dirección si existe en los datos
        address: u.address ? {
          create: {
            ...u.address,
          },
        } : undefined,
      },
    })

    console.log(`✅ Creado: ${user.email} (${user.role})`)
    if (u.address) {
      console.log(`   📍 Dirección: ${u.address.addressLine}, ${u.address.locality}`)
    }
  }

  console.log('\n✨ Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })