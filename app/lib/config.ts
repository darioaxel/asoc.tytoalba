interface NavItem {
  href: string
  label: string
  requiresAuth?: boolean
  icon?: string
  children?: NavItem[]
}

export const siteConfig = {
  name: 'asoc.tytoalba',
  url: 'https://asoc.tytoalba.org',
  ogImage: 'https://shadcn-vue.com/og.jpg',
  description:
    'Sitio web oficial de la asociación Tyto Alba.',
  links: {
    instagram: 'https://instagram.com/asoc.tytoalba',
  },
  navItems: [
    {
      href: '/nosotros',
      label: 'Nosotr@s',
      icon: 'lucide:users',
    },
    {
      href: '/rocodromo',
      label: 'Rocódromo',
      icon: 'lucide:mountain',
    },
    {
      href: '/musica',
      label: 'Música',
      icon: 'lucide:music',
    },
    {
      href: '/contacto',
      label: 'Contacto',
      icon: 'lucide:mail',
    },
    {
      href: '/contacto',
      label: 'Blog',
      icon: 'lucide:newspaper',
    },
    {
      href: '/socios',
      label: 'Socios',
      icon: 'lucide:users',
      // El padre SIEMPRE visible, solo los hijos requieren auth
      children: [
        {
          href: '/socios/area',
          label: 'Mi Área',
          icon: 'lucide:user',
          requiresAuth: true,
        },
        {
          href: '/socios/documentos',
          label: 'Documentación',
          icon: 'lucide:file-text',
          requiresAuth: true,
        },
        {
          href: '/socios/registro',
          label: 'Hazte Socio',
          icon: 'lucide:user-plus',
          // Este NO requiere auth (público)
        },
      ],
      },
  ] as NavItem[],
}

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
}