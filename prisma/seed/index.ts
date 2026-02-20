import { prisma } from './config.js'
import { rawUsers } from './data/users.js'
import { UserSeeder } from './seeders/user.seeder.js'

async function main() {
  console.log('🌱 Iniciando seed...\n')

  try {
    
    // 1. Usuarios 
    const userSeeder = new UserSeeder(prisma)  
    const createdUsers = await userSeeder.run(rawUsers, createdMembershipTypes)     

    console.log('\n✨ Seed completado exitosamente')
  } catch (error) {
    console.error('\n❌ Error en seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())