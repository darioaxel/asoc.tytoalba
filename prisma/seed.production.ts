import { prisma } from './seed/config.js'
import { hashPassword } from './seed/utils/hash.js'
import { MemberType } from './generated/client'
import { productionUsers } from './seed/data/production-users.js'
import { productionPosts } from './seed/data/production-posts.js'

// Tipos de membresía
const membershipTypes = [
  {
    type: MemberType.NORMAL,
    name: 'Socio Normal',
    monthlyFee: 50,
    description: 'Membresía estándar para socios adultos',
  },
  {
    type: MemberType.JUVENIL,
    name: 'Socio Juvenil',
    monthlyFee: 25,
    description: 'Membresía reducida para menores de 25 años',
  },
  {
    type: MemberType.FUNDADOR,
    name: 'Socio Fundador',
    monthlyFee: 0,
    description: 'Membresía especial para socios fundadores',
  },
]

async function main() {
  console.log('🌱 Iniciando seed de PRODUCCIÓN...\n')

  try {
    // 1. Crear tipos de membresía
    console.log('🏷️  Creando tipos de membresía...')
    for (const mt of membershipTypes) {
      await prisma.membershipType.upsert({
        where: { type: mt.type },
        update: {},
        create: mt,
      })
      console.log(`✔  ${mt.name}`)
    }

    // 2. Crear usuarios (root y admin)
    console.log('\n👤 Creando usuarios admin...')
    const createdUsers: any[] = []
    
    for (const userData of productionUsers) {
      const { address, password, ...userInfo } = userData
      
      const existing = await prisma.user.findUnique({
        where: { email: userInfo.email },
      })
      
      if (existing) {
        console.log(`✔  Usuario existente: ${userInfo.email}`)
        createdUsers.push(existing)
        continue
      }

      const hashedPassword = await hashPassword(password)
      
      const user = await prisma.user.create({
        data: {
          ...userInfo,
          password: hashedPassword,
          isActive: true,
          address: address ? { create: address } : undefined,
        },
      })
      
      console.log(`✔  Usuario creado: ${user.email} (${user.role})`)
      createdUsers.push(user)
    }

    // 3. Crear tags
    console.log('\n🏷️  Creando tags...')
    const allTags = productionPosts.flatMap(post => post.tags)
    const uniqueTags = [...new Set(allTags)]
    const tagMap = new Map()
    
    for (const tagName of uniqueTags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: {
          name: tagName,
          slug,
        },
      })
      tagMap.set(tagName, tag)
      console.log(`✔  Tag: ${tagName}`)
    }

    // 4. Crear posts con imágenes
    console.log('\n📝 Creando posts...')
    
    for (let i = 0; i < productionPosts.length; i++) {
      const post = productionPosts[i]
      const author = createdUsers[i % createdUsers.length]
      
      const existing = await prisma.post.findUnique({
        where: { slug: post.slug },
      })
      
      if (existing) {
        console.log(`✔  Post existente: ${post.title}`)
        continue
      }

      // Crear archivo de imagen para el cover
      let coverImageId = null
      if (post.coverUrl) {
        // Verificar si ya existe un archivo con esa URL
        const existingFile = await prisma.file.findUnique({
          where: { path: post.coverUrl },
        })
        
        if (existingFile) {
          coverImageId = existingFile.id
        } else {
          const file = await prisma.file.create({
            data: {
              name: `${post.slug}-cover.jpg`,
              mime: 'image/jpeg',
              size: 0,
              path: post.coverUrl,
              checksum: 'external-url',
            },
          })
          coverImageId = file.id
        }
      }

      await prisma.post.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published,
          publishedAt: post.publishedAt,
          authorId: author.id,
          coverImageId,
          tags: {
            connect: post.tags.map(tagName => ({
              id: tagMap.get(tagName).id,
            })),
          },
        },
      })
      
      console.log(`✔  Post creado: ${post.title}`)
    }

    console.log('\n✨ Seed de producción completado exitosamente')
    console.log('\n⚠️  IMPORTANTE: Cambia las contraseñas por defecto:')
    console.log('   - root@tytoalba.org: root1234')
    console.log('   - admin@tytoalba.org: admin1234')
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
