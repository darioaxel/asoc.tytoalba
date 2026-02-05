import { prisma } from './config.js'
import { rawUsers } from './data/users.js'
import { landingPosts } from './data/posts.js'
import { UserSeeder } from './seeders/user.seeder.js'
import { TagSeeder } from './seeders/tag.seeder.js'
import { PostSeeder } from './seeders/post.seeder.js'

async function main() {
  console.log('🌱 Iniciando seed...\n')

  try {
    // 1. Usuarios
    const userSeeder = new UserSeeder()
    const createdUsers = await userSeeder.run(rawUsers)

    // 2. Tags (extraer de posts)
    const allTags = landingPosts.flatMap(post => post.tags)
    const tagSeeder = new TagSeeder()
    const tagMap = await tagSeeder.run(allTags)

    // 3. Posts
    const postSeeder = new PostSeeder()
    await postSeeder.run(landingPosts, createdUsers, tagMap)

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