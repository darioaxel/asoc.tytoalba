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
      requiresAuth: false,
    },
    {
      href: '/rocodromo',
      label: 'Rocódromo',
      icon: 'lucide:mountain',
      requiresAuth: false,
    },
    {
      href: '/musica',
      label: 'Música',
      icon: 'lucide:music',
      requiresAuth: false,
    },
    {
      href: '/contacto',
      label: 'Contacto',
      icon: 'lucide:mail',
      requiresAuth: false,
    },
    {
      href: '/contacto',
      label: 'Blog',
      icon: 'lucide:newspaper',
      requiresAuth: false,
    },
    {
      href: '/socios',
      label: 'Socios',
      icon: 'lucide:users',
      requiresAuth: false,
      // El padre SIEMPRE visible, solo los hijos requieren auth
      children: [
        {
          href: '/socios/dashboard',
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: "lucide:GalleryVerticalEnd",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "lucide:AudioWaveform",
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: "lucide:Command",
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: "lucide:SquareTerminal",
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: "lucide:Bot",
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: "lucide:BookOpen",
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "lucide:Settings2",
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: "lucide:Frame",
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: "lucide:PieChart",
    },
    {
      name: "Travel",
      url: "#",
      icon: "lucide:Map",
    },
  ],
}


export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
}