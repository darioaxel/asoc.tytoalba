/**
 * Posts reales de www.tytoalba.org para el seed de producción
 * 
 * TODO: Actualizar con los posts reales de la web:
 * 1. Copiar títulos y contenido de www.tytoalba.org
 * 2. Actualizar las URLs de las imágenes
 * 3. Ajustar fechas de publicación
 */

export interface ProductionPostData {
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl: string
  tags: string[]
  published: boolean
  publishedAt: Date
}

export const productionPosts: ProductionPostData[] = [
  {
    title: 'Bienvenidos a Tyto Alba',
    slug: 'bienvenidos-a-tyto-alba',
    excerpt: 'Presentación de la asociación y nuestros objetivos para la comunidad.',
    content: `# Bienvenidos a Tyto Alba

## ¿Quiénes somos?

Tyto Alba es una asociación sin ánimo de lucro dedicada a...

## Nuestros objetivos

- Promover la cultura
- Fomentar la participación comunitaria
- Organizar actividades para todos los públicos

## Contacto

Puedes contactarnos en info@tytoalba.org`,
    coverUrl: 'https://www.tytoalba.org/images/posts/bienvenidos.jpg',
    tags: ['Presentación', 'Asociación'],
    published: true,
    publishedAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    title: 'Actividades 2024',
    slug: 'actividades-2024',
    excerpt: 'Descubre todas las actividades que tenemos preparadas para este año.',
    content: `# Actividades 2024

Este año hemos preparado un calendario lleno de actividades:

## Primer trimestre
- Taller de introducción
- Encuentro de socios

## Segundo trimestre
- Actividades de primavera
- Excursiones

## Contacto

Más información en nuestra web.`,
    coverUrl: 'https://www.tytoalba.org/images/posts/actividades-2024.jpg',
    tags: ['Actividades', 'Calendario'],
    published: true,
    publishedAt: new Date('2024-02-01T10:00:00Z'),
  },
  // TODO: Añadir los 8 posts restantes de www.tytoalba.org
  // Copiar desde la web:
  // 1. Título
  // 2. Contenido completo
  // 3. URL de la imagen destacada
  // 4. Fecha de publicación
]

// Verificación de que tenemos 10 posts
if (productionPosts.length < 10) {
  console.warn(`⚠️  Solo hay ${productionPosts.length} posts definidos. Se necesitan 10.`)
}
