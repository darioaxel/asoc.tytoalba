import { Post, User, Role } from '../../generated/client'
import { prisma } from '../config.js'
import { generateSlug } from '../utils/slug.js'
import { PostData } from '../types'

export class PostSeeder {
  async run(posts: PostData[], users: User[], tagMap: Map<string, any>): Promise<void> {
    console.log('\n📝 Seed de posts...\n')
    
    const adminUsers = users.filter(u => 
      u.role === Role.ADMIN || u.role === Role.ROOT
    )

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const author = adminUsers[i % adminUsers.length]
      const slug = generateSlug(post.title)
      
      const exists = await prisma.post.findUnique({ where: { slug } })
      if (exists) {
        console.log(`✔  Post existente: ${post.title}`)
        continue
      }

      await prisma.post.create({
        data: {
          title: post.title,
          slug,
          excerpt: post.excerpt,
          content: post.content,
          cover: post.cover,
          published: post.published,
          publishedAt: post.publishedAt,
          authorId: author.id,
          tags: {
            connect: post.tags.map(tagName => ({
              id: tagMap.get(tagName)!.id
            }))
          }
        }
      })
      
      console.log(`✔  Post creado: ${post.title} (autor: ${author.firstName})`)
    }
  }
}