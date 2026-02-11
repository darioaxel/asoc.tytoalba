import { Tag } from '../../generated/client'
import { prisma } from '../config.js'
import { generateSlug } from '../utils/slug.js'

export class TagSeeder {
  async run(tagNames: string[]): Promise<Map<string, Tag>> {
    console.log('\n🏷️  Seed de tags...\n')
    const tagMap = new Map<string, Tag>()
    const uniqueTags = [...new Set(tagNames)]

    for (const name of uniqueTags) {
      const slug = generateSlug(name)
      const existing = await prisma.tag.findUnique({ where: { slug } })
      
      if (existing) {
        console.log(`✔  Tag existente: ${existing.name}`)
        tagMap.set(name, existing)
      } else {
        const created = await prisma.tag.create({
          data: { name, slug }
        })
        console.log(`✔  Tag creado: ${created.name}`)
        tagMap.set(name, created)
      }
    }

    return tagMap
  }
}