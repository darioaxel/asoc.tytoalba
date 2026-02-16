interface NavItem {
  href: string
  label: string
  requiresAuth?: boolean
  icon?: string
  children?: NavItem[]
}

// Define interfaces
interface NavSubItem {
  title: string
  url: string
}

interface NavMainItem {
  title: string
  url: string
  icon?: string // formato 'lucide:icon-name'
  isActive?: boolean
  items?: NavSubItem[]
}

export interface NavSection {
  title: string
  roles?: string[] 
  items: NavMainItem[]
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
      href: '/blog',
      label: 'Blog',
      icon: 'lucide:newspaper',
      requiresAuth: false,
    },
    {
      href: '/socios',
      label: 'Socios',
      icon: 'lucide:users',
      requiresAuth: false,
      children: [
        {
          href: '/socios/landing',
          label: 'Soci@s',
          icon: 'lucide:info',
        },
        {
          href: '/socios/solicitud',
          label: 'Hazte Socio',
          icon: 'lucide:user-plus',
        },
      ],
    },
  ] as NavItem[],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Asociación Tyto Alba",
      logo: "lucide:GalleryVerticalEnd",
      plan: "Enterprise",
    }
  ],
  navSections: [
    {
      title: 'Socio',
      roles: ['ROOT', 'USER', 'ADMIN'],
      items: [
        {
          title: "Mis Cuotas",
          url: "/socios/recibos",
          icon: "lucide:receipt",
          isActive: true,
          items: [
            { title: "Mis Recibos", url: "/socios/recibos" },
            { title: "Pagar Recibos", url: "/socios/pagar" },
            
          ],
        },   
        {
          title: "Propuestas",
          url: "/socios/propuestas",
          icon: "lucide:vote",
          isActive: true,
          items: [
            { title: "Crear propuestas", url: "/socios/propuesta/nueva" },            
          ],
        },       
        {
          title: "Documentación",
          url: "#",
          icon: "lucide:book-open",
          items: [
            { title: "Estatutos", url: "#" },
            { title: "Otros", url: "#" },
          ],
        },
      ]
    },
    {
      title: 'Administración',      
      roles: ['ADMIN', 'ROOT'],
      items: [
        {
          title: "Cuentas asociación",
          url: "#",
          icon: "lucide:bot",
          items: [
            { title: "Lista Morosos", url: "#" },
            { title: "Ingresos - Gastos", url: "#" },
            { title: "Cargar Facturas", url: "#" },
          ],
        },
        {
          title: "Tesorería",
          url: "#",
          icon: "lucide:settings-2",
          items: [
            { title: "Validación Pagos", url: "#" },
            { title: "Creación de Recibos", url: "#" },           
          ],
        },
        {
          title: "Tareas",
          url: "#",
          icon: "lucide:list-todo",
          isActive: true,
          items: [
            { title: "Gestionar tareas", url: "/socios/tareas" },
            { title: "Crear tarea", url: "/socios/tarea/nueva" },
          ],
        },
      ]
    },
  ] as NavSection[],
  navSecondary: [
    {
      title: "Página Inicio",
      url: "/",
      icon: "lucide:home"
    },
  ]
}


export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
}