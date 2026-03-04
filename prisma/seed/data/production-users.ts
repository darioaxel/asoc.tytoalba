import { Role } from '../../generated/client'

/**
 * Usuarios de producción - SOLO Admin y Root
 * 
 * ⚠️  IMPORTANTE: Cambiar las contraseñas después del primer login
 */

export const productionUsers = [
  {
    email: 'root@tytoalba.org',
    password: 'root1234', // CAMBIAR EN PRODUCCIÓN
    role: Role.ROOT,
    firstName: 'Administrador',
    lastName: 'Principal',
    dni: '00000000A',
    phone: '+34000000000',
    birthDate: new Date('1980-01-01'),
    emailPersonal: 'root@tytoalba.org',
    address: {
      addressLine: 'Calle Principal 1',
      postalCode: '28001',
      locality: 'Madrid',
      province: 'Madrid',
    },
  },
  {
    email: 'admin@tytoalba.org',
    password: 'admin1234', // CAMBIAR EN PRODUCCIÓN
    role: Role.ADMIN,
    firstName: 'Admin',
    lastName: 'Tyto Alba',
    dni: '11111111B',
    phone: '+34111111111',
    birthDate: new Date('1985-01-01'),
    emailPersonal: 'admin@tytoalba.org',
    address: {
      addressLine: 'Calle Secundaria 2',
      postalCode: '28002',
      locality: 'Madrid',
      province: 'Madrid',
    },
  },
]
