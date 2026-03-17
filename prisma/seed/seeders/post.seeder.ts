import { Post, User, Role } from '../../generated/client'
import { prisma } from '../config.js'
import { generateSlug } from '../utils/slug.js'
import { PostData } from '../types.js'
import { copyFile, mkdir, stat } from 'fs/promises'
import { join } from 'path'
import { createHash } from 'crypto'

export class PostSeeder {
  async run(posts: PostData[], users: User[], tagMap: Map<string, any>): Promise<void> {
    console.log('\n📝 Seed de posts...\n')
    
    const adminUsers = users.filter(u => 
      u.role === Role.ADMIN || u.role === Role.ROOT
    )

    // Asegurar que existe el directorio de uploads
    const uploadsDir = join(process.cwd(), 'public', 'images', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const author = adminUsers[i % adminUsers.length]
      const slug = generateSlug(post.title)
      
      const exists = await prisma.post.findUnique({ where: { slug } })
      if (exists) {
        console.log(`✔  Post existente: ${post.title}`)
        continue
      }

      // Manejar la imagen de portada
      let coverImageId: string | undefined = undefined
      
      if (post.cover) {
        // Si es ruta local (no URL externa)
        if (!post.cover.startsWith('http')) {
          const sourcePath = post.cover.startsWith('/') 
            ? join(process.cwd(), 'public', post.cover)
            : join(process.cwd(), post.cover)
          
          try {
            // Verificar que el archivo existe
            const fileStat = await stat(sourcePath)
            
            // Generar nombre único para el archivo
            const fileName = `${Date.now()}-${i}-${slug}.jpg`
            const destPath = join(uploadsDir, fileName)
            const publicPath = `/images/uploads/${fileName}`
            
            // Copiar archivo
            await copyFile(sourcePath, destPath)
            
            // Calcular checksum
            const checksum = createHash('md5').update(fileName).digest('hex')
            
            // Crear registro en File
            const fileRecord = await prisma.file.create({
              data: {
                name: fileName,
                mime: 'image/jpeg',
                size: fileStat.size,
                path: publicPath,
                checksum,
              }
            })
            
            coverImageId = fileRecord.id
            console.log(`  📷 Imagen copiada: ${fileName}`)
          } catch (error) {
            console.warn(`  ⚠️ No se pudo procesar la imagen: ${post.cover}`, error)
          }
        } else {
          // Para URLs externas, descargar la imagen
          try {
            const response = await fetch(post.cover)
            if (response.ok) {
              const buffer = Buffer.from(await response.arrayBuffer())
              const fileName = `${Date.now()}-${i}-${slug}.jpg`
              const destPath = join(uploadsDir, fileName)
              const publicPath = `/images/uploads/${fileName}`
              
              // Guardar archivo
              const { writeFile } = await import('fs/promises')
              await writeFile(destPath, buffer)
              
              // Calcular checksum
              const checksum = createHash('md5').update(buffer).digest('hex')
              
              // Crear registro en File
              const fileRecord = await prisma.file.create({
                data: {
                  name: fileName,
                  mime: 'image/jpeg',
                  size: buffer.length,
                  path: publicPath,
                  checksum,
                }
              })
              
              coverImageId = fileRecord.id
              console.log(`  📷 Imagen descargada: ${fileName}`)
            }
          } catch (error) {
            console.warn(`  ⚠️ No se pudo descargar la imagen: ${post.cover}`, error)
          }
        }
      }

      await prisma.post.create({
        data: {
          title: post.title,
          slug,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published,
          publishedAt: post.publishedAt,
          authorId: author.id,
          coverImageId,
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
