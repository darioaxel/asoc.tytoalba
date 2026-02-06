import { prisma } from './config.js'
import { rawUsers } from './data/users.js'
import { membershipTypes } from './data/membership-types.js'
import { landingPosts } from './data/posts.js'
import { UserSeeder } from './seeders/user.seeder.js'
import { TagSeeder } from './seeders/tag.seeder.js'
import { PostSeeder } from './seeders/post.seeder.js'
import { ReceiptSeeder } from './seeders/receipts.seeder.js'
import { MembershipTypeSeeder } from './seeders/membership-types.seeder.js'

async function main() {
  console.log('🌱 Iniciando seed...\n')

  try {
    // 0. Tipos de membresía (primero, necesario para usuarios)
    const membershipTypeSeeder = new MembershipTypeSeeder(prisma)  
    const createdMembershipTypes = await membershipTypeSeeder.run(membershipTypes)

    // 1. Usuarios 
    const userSeeder = new UserSeeder(prisma)  
    const createdUsers = await userSeeder.run(rawUsers, createdMembershipTypes)  

    // 2. Tags (extraer de posts)
    const allTags = landingPosts.flatMap(post => post.tags)
    const tagSeeder = new TagSeeder(prisma)  
    const tagMap = await tagSeeder.run(allTags)

    // 3. Posts
    const postSeeder = new PostSeeder(prisma)  
    await postSeeder.run(landingPosts, createdUsers, tagMap)

    // 4. Recibos (2 años, con todos los escenarios)
    const receiptSeeder = new ReceiptSeeder(prisma)
    await receiptSeeder.run(createdUsers)

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